import type { Flag, FlagPayloadType } from "@switchboard/common";
import { $try, SwitchboardClientError } from "@switchboard/common";
import { ConvexHttpClient } from "convex/browser";
import { anyApi } from "convex/server";

const flagQuery = anyApi.sdk.queries.getFlagQuery;

export type SwitchboardHttpClientConstructorOpts = {
  /** The API key for authenticating with Switchboard (prefixed with `pk_`). */
  apiKey: string;
  /**
   * The base URL of the Switchboard backend (Convex HTTP endpoint).
   * @example "http://127.0.0.1:3210"
   */
  switchboardHost: string;
};

/**
 * Non-realtime Switchboard client that fetches flags via HTTP.
 * Designed for server-side and edge environments where realtime subscriptions aren't needed.
 *
 * @example
 * ```ts
 * const client = new SwitchboardHttpClient({
 *   apiKey: 'pk_...',
 *   switchboardHost: 'https://flags.example.com',
 * })
 *
 * const { enabled, payload } = await client.getFlag<boolean>('new-checkout')
 * ```
 */
export class SwitchboardHttpClient {
  private client: ConvexHttpClient;
  private apiKey: string;

  constructor({
    apiKey,
    switchboardHost,
  }: SwitchboardHttpClientConstructorOpts) {
    this.apiKey = apiKey;
    this.client = new ConvexHttpClient(switchboardHost);
  }

  /**
   * Fetch a feature flag by key.
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
}
