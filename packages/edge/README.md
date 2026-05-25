# @switchboard/edge

Edge/server SDK for [Switchboard](https://github.com/Carlos-err406/switchboard) feature flags. Fetches flags via HTTP — designed for server-side and edge environments where realtime subscriptions aren't needed.

## Install

```sh
npm install @switchboard/edge
```

## Setup

```ts
import { SwitchboardHttpClient } from '@switchboard/edge'

const client = new SwitchboardHttpClient({
  apiKey: 'pk_...',
  switchboardHost: 'https://flags.example.com',
})
```

## Usage

### With a default value (recommended)

Returns the default on any failure — network errors, invalid key, disabled flag. Your app never breaks because of a flag fetch.

```ts
const enabled = await client.getFlag('new-checkout', false)
// => true | false (never throws)
```

### Without a default value

Throws a `SwitchboardClientError` if the flag can't be fetched.

```ts
const value = await client.getFlag<string>('banner-text')
// => string | undefined (throws on network/auth errors)
```

## Error handling

By default, errors are silently swallowed when a `defaultValue` is provided. Use `onError` to get notified:

```ts
const client = new SwitchboardHttpClient({
  apiKey: 'pk_...',
  switchboardHost: 'https://flags.example.com',
  onError: (err) => {
    console.error('Switchboard error:', err.message)
    // or: Sentry.captureException(err)
  },
})
```

The behavior matrix:

| Scenario                     | With `defaultValue`                     | Without `defaultValue`          |
| ---------------------------- | --------------------------------------- | ------------------------------- |
| Flag found and enabled       | Returns flag value                      | Returns flag value              |
| Flag found but disabled      | Returns `defaultValue`                  | Returns `undefined`             |
| Network / auth / parse error | Returns `defaultValue`, calls `onError` | Throws `SwitchboardClientError` |
