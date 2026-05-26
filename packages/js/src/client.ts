import type {
  FlagValueType,
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
   * @example "http://127.0.0.1:3210" -
   */
  url: string;
  /**
   * Called whenever a flag operation fails but a `defaultValue` was provided.
   * Without this callback, errors are silently swallowed and the default is returned.
   * Without a `defaultValue`, errors are always thrown regardless of this callback.
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
 * Designed for browser and JS environments where live flag updates are needed.
 *
 * @example
 * ```ts
 * const client = new SwitchboardWsClient({
 *   apiKey: 'pk_...',
 *   url: 'https://flags.example.com',
 * })
 *
 * // One-shot read — throws if the flag doesn't exist
 * const value = await client.getFlag<boolean>('new-checkout')
 *
 * // With default — returns the default on any error
 * const value = await client.getFlag('new-checkout', false)
 *
 * // Realtime subscription
 * const unsubscribe = client.on('new-checkout', false, (value) => {
 *   console.log('flag changed:', value)
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
   * Fetch a feature flag value by key (one-shot).
   *
   * With `defaultValue`: returns the default on any failure
   * and notifies the `onError` callback if one was provided.
   *
   * Without `defaultValue`: throws a {@link SwitchboardWsClientError} on failure.
   *
   * @param key - The flag key to look up.
   * @param defaultValue - Fallback value returned when the flag is disabled or the request fails.
   * @returns The flag value, the default, or `undefined` if the flag is disabled and no default was given.
   */
  public async getFlag<T extends FlagValueType>(
    key: string,
    defaultValue: T,
  ): Promise<T>;
  public async getFlag<T extends FlagValueType>(
    key: string,
  ): Promise<T | undefined>;
  public async getFlag<T extends FlagValueType>(
    key: string,
    defaultValue?: T,
  ): Promise<T | undefined> {
    const [getFlagError, flag] = await $try<{
      enabled: boolean;
      value: T;
      key: string;
    }>(
      this.client.query(flagQuery, {
        flagKey: key,
        apiKey: this.apiKey,
      }),
    );
    if (getFlagError) {
      const error = new SwitchboardClientError(getFlagError);
      if (defaultValue !== undefined) {
        this.onError?.(error);
        return defaultValue;
      }
      throw error;
    }
    if (flag.enabled) return flag.value;
    return defaultValue ?? undefined;
  }

  /**
   * Subscribe to realtime updates for a flag.
   *
   * @param key - The flag key to subscribe to.
   * @param defaultValue - Fallback value used when the flag is disabled or on error.
   * @param callback - Called with the flag value whenever it changes.
   * @returns An unsubscribe function to stop the subscription.
   */
  public on<T extends FlagValueType>(
    key: string,
    callback: (value: T | undefined) => void,
    defaultValue?: T,
  ): () => void {
    return this.client.onUpdate(
      flagQuery,
      { flagKey: key, apiKey: this.apiKey },
      (flag: { enabled: boolean; value: T; key: string }) => {
        callback(flag.enabled ? flag.value : defaultValue);
      },
      (e: Error) => {
        const error = new SwitchboardClientError(e);
        this.onError?.(error);
        callback(defaultValue);
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
