import type {
  Flag,
  FlagPayloadType,
  SwitchboardClientOnErrorCallback,
} from "@switchboard/common";
import { $try, SwitchboardClientError } from "@switchboard/common";
import type { ConnectionState } from "convex/browser";
import { ConvexClient, ConvexHttpClient } from "convex/browser";
import { anyApi } from "convex/server";

const flagQuery = anyApi.sdk.queries.getFlagQuery;

export type SwitchboardClientMode = "realtime" | "poll";

export type SwitchboardClientConstructorOpts = {
  /** The API key for authenticating with Switchboard (prefixed with `pk_`). */
  apiKey: string;
  /**
   * The URL of the Switchboard backend (Convex endpoint).
   * @example "http://127.0.0.1:3210"
   */
  url: string;
  /**
   * Transport mode.
   * - `"realtime"` — persistent WebSocket, instant flag updates (default)
   * - `"poll"` — periodic HTTP fetches, no persistent connection
   *
   * Use `"poll"` when your deployment handles high concurrent browser connections
   * and you want to reduce WebSocket pressure on the Convex backend.
   * @default "realtime"
   */
  mode?: SwitchboardClientMode;
  /**
   * Polling interval in milliseconds. Only used when `mode` is `"poll"`.
   * @default 30000
   */
  pollInterval?: number;
  /**
   * Called when a flag subscription encounters an error.
   *
   * @example
   * ```ts
   * const client = new SwitchboardClient({
   *   apiKey: 'pk_...',
   *   url: 'https://flags.example.com',
   *   onError: (err) => Sentry.captureException(err),
   * })
   * ```
   */
  onError?: SwitchboardClientOnErrorCallback;
};

/**
 * Switchboard client that subscribes to feature flags.
 *
 * Supports two transport modes:
 * - `"realtime"` (default) — WebSocket via Convex, instant flag updates
 * - `"poll"` — HTTP polling, no persistent connection, lower server load
 *
 * @example
 * ```ts
 * // Realtime (default)
 * const client = new SwitchboardClient({
 *   apiKey: 'pk_...',
 *   url: 'https://flags.example.com',
 * })
 *
 * // Polling mode for high-traffic deployments
 * const client = new SwitchboardClient({
 *   apiKey: 'pk_...',
 *   url: 'https://flags.example.com',
 *   mode: 'poll',
 *   pollInterval: 15_000,
 * })
 *
 * // One-shot read
 * const { enabled, payload } = await client.getFlag<boolean>('new-checkout')
 *
 * // Realtime subscription (works in both modes)
 * const unsubscribe = client.on('new-checkout', ({ enabled, payload }) => {
 *   console.log('flag changed:', enabled, payload)
 * })
 * ```
 */
export class SwitchboardClient {
  private wsClient: ConvexClient | null = null;
  private httpClient: ConvexHttpClient | null = null;
  private apiKey: string;
  private mode: SwitchboardClientMode;
  private pollMs: number;
  private onError?: SwitchboardClientOnErrorCallback;
  private pollTimers = new Set<ReturnType<typeof setInterval>>();

  constructor({
    apiKey,
    url,
    mode = "realtime",
    pollInterval = 30_000,
    onError,
  }: SwitchboardClientConstructorOpts) {
    this.apiKey = apiKey;
    this.mode = mode;
    this.pollMs = pollInterval;
    this.onError = onError;

    if (mode === "realtime") {
      this.wsClient = new ConvexClient(url);
    } else {
      this.httpClient = new ConvexHttpClient(url);
    }
  }

  /**
   * Fetch a feature flag by key (one-shot).
   * Throws a {@link SwitchboardClientError} on failure.
   */
  public async getFlag<T extends FlagPayloadType>(
    key: string,
  ): Promise<Flag<T>> {
    const client = this.wsClient ?? this.httpClient!;
    const [error, flag] = await $try<{
      enabled: boolean;
      payload?: T;
      key: string;
    }>(
      client.query(flagQuery, {
        flagKey: key,
        apiKey: this.apiKey,
      }),
    );
    if (error) throw new SwitchboardClientError(error);
    return { enabled: flag.enabled, payload: flag.payload };
  }

  /**
   * Subscribe to updates for a flag.
   *
   * In `"realtime"` mode, the callback fires instantly on every flag change.
   * In `"poll"` mode, the callback fires on each poll interval when the value has changed.
   *
   * @param key - The flag key to subscribe to.
   * @param callback - Called with the flag state whenever it changes.
   * @returns An unsubscribe function.
   */
  public on<T extends FlagPayloadType>(
    key: string,
    callback: (flag: Flag<T>) => void,
  ): () => void {
    if (this.mode === "realtime") {
      return this.wsClient!.onUpdate(
        flagQuery,
        { flagKey: key, apiKey: this.apiKey },
        (flag: { enabled: boolean; payload?: T; key: string }) => {
          callback({ enabled: flag.enabled, payload: flag.payload });
        },
        (e: Error) => {
          this.onError?.(new SwitchboardClientError(e));
        },
      );
    }

    let lastSerialized: string | undefined;
    let active = true;

    const poll = async () => {
      if (!active) return;
      const [error, flag] = await $try<{
        enabled: boolean;
        payload?: T;
        key: string;
      }>(
        this.httpClient!.query(flagQuery, {
          flagKey: key,
          apiKey: this.apiKey,
        }),
      );
      if (!active) return;
      if (error) {
        this.onError?.(new SwitchboardClientError(error));
        return;
      }
      const serialized = JSON.stringify(flag);
      if (serialized !== lastSerialized) {
        lastSerialized = serialized;
        callback({ enabled: flag.enabled, payload: flag.payload });
      }
    };

    poll();
    const timer = setInterval(poll, this.pollMs);
    this.pollTimers.add(timer);

    return () => {
      active = false;
      clearInterval(timer);
      this.pollTimers.delete(timer);
    };
  }

  /**
   * Subscribe to connection state changes.
   * Only meaningful in `"realtime"` mode — returns a no-op in `"poll"` mode.
   */
  public onConnectionChange(
    callback: (state: ConnectionState) => void,
  ): () => void {
    if (this.mode === "realtime") {
      return this.wsClient!.subscribeToConnectionState(callback);
    }
    return () => {};
  }

  /** Close the connection and clear all poll timers. */
  public async close(): Promise<void> {
    for (const timer of this.pollTimers) {
      clearInterval(timer);
    }
    this.pollTimers.clear();
    if (this.wsClient) {
      await this.wsClient.close();
    }
  }
}

/** @deprecated Use {@link SwitchboardClient} instead. */
export { SwitchboardClient as SwitchboardWsClient };
/** @deprecated Use {@link SwitchboardClientConstructorOpts} instead. */
export type { SwitchboardClientConstructorOpts as SwitchboardWsClientConstructorOpts };
