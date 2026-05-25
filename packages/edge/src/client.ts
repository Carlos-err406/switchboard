import type { SwitchboardClientOnErrorCallback } from '@switchboard/common'
import { $try, SwitchboardClientError } from '@switchboard/common'

export type SwitchboardHttpClientConstructorOpts = {
  /** The API key for authenticating with Switchboard (prefixed with `pk_`). */
  apiKey: string
  /**
   * The base URL of the Switchboard backend (Convex HTTP endpoint).
   * @example "http://127.0.0.1:3211"
   */
  switchboardHost: string
  /**
   * Called whenever a flag fetch fails but a `defaultValue` was provided.
   * Without this callback, errors are silently swallowed and the default is returned.
   * Without a `defaultValue`, errors are always thrown regardless of this callback.
   *
   * @example
   * ```ts
   * const client = new SwitchboardHttpClient({
   *   apiKey: 'pk_...',
   *   switchboardHost: 'https://flags.example.com',
   *   onError: (err) => Sentry.captureException(err),
   * })
   * ```
   */
  onError?: SwitchboardClientOnErrorCallback
}

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
 * // Throws if the flag doesn't exist or the request fails
 * const value = await client.getFlag<boolean>('new-checkout')
 *
 * // Returns the default value on any error, and notifies via onError
 * const value = await client.getFlag('new-checkout', false)
 * ```
 */
export class SwitchboardHttpClient {
  private apiKey: string
  private switchboardHost: string
  private readonly ENDPOINT = '/api/flags'
  private onError?: SwitchboardClientOnErrorCallback
  constructor({
    apiKey,
    switchboardHost,
    onError,
  }: SwitchboardHttpClientConstructorOpts) {
    this.apiKey = apiKey
    this.switchboardHost = switchboardHost
    this.onError = onError
  }
  /**
   * Fetch a feature flag value by key.
   *
   * With `defaultValue`: returns the default on any failure (network, auth, parse)
   * and notifies the `onError` callback if one was provided.
   *
   * Without `defaultValue`: throws a {@link SwitchboardClientError} on failure.
   *
   * @param key - The flag key to look up.
   * @param defaultValue - Fallback value returned when the flag is disabled or the request fails.
   * @returns The flag value, the default, or `undefined` if the flag is disabled and no default was given.
   */
  public async getFlag<T extends string | number | boolean | null>(
    key: string,
    defaultValue: T,
  ): Promise<T>
  public async getFlag<T extends string | number | boolean | null>(
    key: string,
  ): Promise<T | undefined>
  public async getFlag<T extends string | number | boolean | null>(
    key: string,
    defaultValue?: T,
  ): Promise<T | undefined> {
    const url = new URL(this.ENDPOINT, this.switchboardHost)
    url.searchParams.set('flag', key)
    const headers = new Headers()
    headers.append('authorization', `Bearer ${this.apiKey}`)
    const [fetchError, response] = await $try(fetch(url, { headers }))
    if (fetchError) {
      const error = new SwitchboardClientError(fetchError)
      if (defaultValue !== undefined) {
        this.onError?.(error)
        return defaultValue
      }
      throw error
    }
    if (!response.ok) {
      const errorMessage = await response.text()
      const error = new SwitchboardClientError(errorMessage)
      if (defaultValue !== undefined) {
        this.onError?.(error)
        return defaultValue
      }
      throw error
    }

    const [parseError, flag] = await $try<{
      enabled: boolean
      value: T
      key: string
    }>(response.json())
    if (parseError) {
      const error = new SwitchboardClientError(
        'Error parsing switchboard response: ' + parseError,
      )
      if (defaultValue !== undefined) {
        this.onError?.(error)
        return defaultValue
      }
      throw error
    }
    if (flag.enabled) return flag.value
    else if (defaultValue !== undefined) return defaultValue
    else return undefined
  }
}
