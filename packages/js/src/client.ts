import type {
  Flag,
  FlagPayloadType,
  SwitchboardClientOnErrorCallback,
} from "@switchboard/common";
import { $try, SwitchboardClientError } from "@switchboard/common";
import type { ConnectionState } from "convex/browser";
import { ConvexClient } from "convex/browser";
import { anyApi } from "convex/server";

const flagQuery = anyApi.sdk.queries.getFlagQuery;

export type SwitchboardWsClientConstructorOpts = {
  /** The API key for authenticating with Switchboard (prefixed with `pk_`). */
  apiKey: string;
  /**
   * The URL of the Switchboard backend (Convex WebSocket endpoint).
   * @example "http://127.0.0.1:3210"
   */
  url: string;
  /**
   * Called when a flag subscription encounters an error.
   *
   * @example
   * ```ts
   * const client = new SwitchboardWsClient({
   *   apiKey: 'pk_...',
   *   url: 'https://flags.example.com',
   *   onError: (err) => Sentry.captureException(err),
   * })
   * ```
   */
  onError?: SwitchboardClientOnErrorCallback;
};

/**
 * Realtime Switchboard client that subscribes to flags via WebSocket.
 *
 * @example
 * ```ts
 * const client = new SwitchboardWsClient({
 *   apiKey: 'pk_...',
 *   url: 'https://flags.example.com',
 * })
 *
 * // One-shot read — throws if the flag doesn't exist
 * const { enabled, payload } = await client.getFlag<boolean>('new-checkout')
 *
 * // Realtime subscription
 * const unsubscribe = client.on('new-checkout', ({ enabled, payload }) => {
 *   console.log('flag changed:', enabled, payload)
 * })
 * ```
 */
export class SwitchboardWsClient {
  private client: ConvexClient;
  private apiKey: string;
  private onError?: SwitchboardClientOnErrorCallback;

  constructor({ apiKey, url, onError }: SwitchboardWsClientConstructorOpts) {
    this.apiKey = apiKey;
    this.client = new ConvexClient(url);
    this.onError = onError;
  }

  /**
   * Fetch a feature flag by key (one-shot).
   * Throws a {@link SwitchboardClientError} on failure.
   */
  public async getFlag<T extends FlagPayloadType>(
    key: string,
  ): Promise<Flag<T>> {
    const [error, flag] = await $try<{
      enabled: boolean;
      payload?: T;
      key: string;
    }>(
      this.client.query(flagQuery, {
        flagKey: key,
        apiKey: this.apiKey,
      }),
    );
    if (error) throw new SwitchboardClientError(error);
    return { enabled: flag.enabled, payload: flag.payload };
  }

  /**
   * Subscribe to realtime updates for a flag.
   *
   * @param key - The flag key to subscribe to.
   * @param callback - Called with the flag state whenever it changes.
   * @returns An unsubscribe function.
   */
  public on<T extends FlagPayloadType>(
    key: string,
    callback: (flag: Flag<T>) => void,
  ): () => void {
    return this.client.onUpdate(
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

  /**
   * Subscribe to connection state changes.
   *
   * @param callback - Called whenever the connection state changes.
   * @returns An unsubscribe function.
   */
  public onConnectionChange(
    callback: (state: ConnectionState) => void,
  ): () => void {
    return this.client.subscribeToConnectionState(callback);
  }

  /** Close the WebSocket connection. */
  public async close(): Promise<void> {
    await this.client.close();
  }
}
