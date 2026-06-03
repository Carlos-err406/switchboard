# @switchboard/js

Browser/JS SDK for [Switchboard](https://github.com/Carlos-err406/switchboard) feature flags. Subscribes to flags in realtime over a WebSocket, or polls over HTTP when you'd rather not hold a persistent connection.

For server-only / edge runtimes that just need a one-shot HTTP read, use [`@switchboard/edge`](../edge). For React, use [`@switchboard/react`](../react).

## Install

```sh
npm install @switchboard/js
```

## Setup

```ts
import { SwitchboardClient } from "@switchboard/js";

const client = new SwitchboardClient({
  apiKey: "pk_...",
  url: "https://flags.example.com",
});
```

## Transport modes

| Mode                   | Transport             | Use when                                                                                          |
| ---------------------- | --------------------- | ------------------------------------------------------------------------------------------------- |
| `"realtime"` (default) | persistent WebSocket  | you want instant flag updates                                                                     |
| `"poll"`               | periodic HTTP fetches | you have high concurrent browser connections and want to reduce WebSocket pressure on the backend |

```ts
// Realtime (default)
const client = new SwitchboardClient({
  apiKey: "pk_...",
  url: "https://flags.example.com",
});

// Polling — fetches every `pollInterval` ms (default 30000)
const client = new SwitchboardClient({
  apiKey: "pk_...",
  url: "https://flags.example.com",
  mode: "poll",
  pollInterval: 15_000,
});
```

## Usage

### One-shot read

```ts
const { enabled, payload } = await client.getFlag<boolean>("new-checkout");
// throws SwitchboardClientError on failure
```

### Subscribe to changes

`on()` works in both modes. In `"realtime"` it fires on every change; in `"poll"` it fires whenever a poll detects a changed value. It returns an unsubscribe function.

```ts
const unsubscribe = client.on<string>("banner-text", ({ enabled, payload }) => {
  console.log("flag changed:", enabled, payload);
});

// later
unsubscribe();
```

### Connection state

Only meaningful in `"realtime"` mode (a no-op in `"poll"`):

```ts
client.onConnectionChange((state) => {
  console.log(state.isWebSocketConnected ? "connected" : "reconnecting");
});
```

### Cleanup

```ts
await client.close(); // closes the WebSocket and clears all poll timers
```

## Error handling

`getFlag` throws a `SwitchboardClientError` on failure. For subscriptions, pass `onError` to be notified — its `cause` holds the underlying error.

```ts
const client = new SwitchboardClient({
  apiKey: "pk_...",
  url: "https://flags.example.com",
  onError: (err) => {
    console.error("Switchboard error:", err.message);
    // or: Sentry.captureException(err)
  },
});
```

## API

### `new SwitchboardClient(opts)`

| Option         | Type                                    | Default      | Description                           |
| -------------- | --------------------------------------- | ------------ | ------------------------------------- |
| `apiKey`       | `string`                                | —            | The `pk_`-prefixed API key.           |
| `url`          | `string`                                | —            | Switchboard backend (Convex) URL.     |
| `mode`         | `"realtime" \| "poll"`                  | `"realtime"` | Transport mode.                       |
| `pollInterval` | `number`                                | `30000`      | Poll interval in ms (poll mode only). |
| `onError`      | `(err: SwitchboardClientError) => void` | —            | Subscription error callback.          |

### Methods

- `getFlag<T>(key): Promise<Flag<T>>` — one-shot read; throws on failure.
- `on<T>(key, callback): () => void` — subscribe; returns an unsubscribe function.
- `onConnectionChange(callback): () => void` — connection-state updates (realtime only).
- `close(): Promise<void>` — close the connection and clear poll timers.

> `SwitchboardWsClient` and `SwitchboardWsClientConstructorOpts` are deprecated aliases of `SwitchboardClient` / `SwitchboardClientConstructorOpts`.

## Sample

A runnable demo lives in [`samples/js-sample`](../../samples/js-sample).
