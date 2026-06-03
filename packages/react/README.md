# @switchboard/react

React bindings for [Switchboard](https://github.com/Carlos-err406/switchboard) feature flags. A provider plus hooks built on top of [`@switchboard/js`](../js) — flag values update in your components in realtime (or on a poll interval).

## Install

```sh
npm install @switchboard/react
```

Requires React `^19`.

## Setup

Wrap your app in `SwitchboardProvider`:

```tsx
import { SwitchboardProvider } from "@switchboard/react";

createRoot(document.getElementById("root")!).render(
  <SwitchboardProvider
    apiKey="pk_..."
    switchboardHost="https://flags.example.com"
  >
    <App />
  </SwitchboardProvider>,
);
```

For high-traffic deployments, switch to polling instead of a persistent WebSocket:

```tsx
<SwitchboardProvider
  apiKey="pk_..."
  switchboardHost="https://flags.example.com"
  mode="poll"
  pollInterval={15_000}
>
  <App />
</SwitchboardProvider>
```

## Usage

### `useFlag`

Subscribes to a flag and re-renders when it changes. Returns `undefined` until the first value arrives.

```tsx
import { useFlag } from "@switchboard/react";

function Checkout() {
  const flag = useFlag<boolean>("new-checkout");

  if (!flag) return <Spinner />;
  return flag.enabled ? <NewCheckout /> : <LegacyCheckout />;
}
```

The payload is typed:

```tsx
const banner = useFlag<string>("banner-text");
// banner?.payload is string | undefined
```

### `useConnectionState`

Reflects the realtime connection state. Returns `null` in poll mode (no persistent connection).

```tsx
import { useConnectionState } from "@switchboard/react";

function ConnectionBadge() {
  const state = useConnectionState();
  return <span>{state?.isWebSocketConnected ? "live" : "reconnecting"}</span>;
}
```

### `useSwitchboardProvider`

Escape hatch to reach the underlying `SwitchboardClient` (e.g. for a one-shot `getFlag`). Throws if used outside `<SwitchboardProvider>`.

```tsx
const { client } = useSwitchboardProvider();
const { enabled } = await client.getFlag<boolean>("new-checkout");
```

## API

### `<SwitchboardProvider>`

| Prop              | Type                   | Default      | Description                           |
| ----------------- | ---------------------- | ------------ | ------------------------------------- |
| `apiKey`          | `string`               | —            | The `pk_`-prefixed API key.           |
| `switchboardHost` | `string`               | —            | Switchboard backend (Convex) URL.     |
| `mode`            | `"realtime" \| "poll"` | `"realtime"` | Transport mode.                       |
| `pollInterval`    | `number`               | `30000`      | Poll interval in ms (poll mode only). |

### Hooks

- `useFlag<T>(key): Flag<T> | undefined`
- `useConnectionState(): ConnectionState | null`
- `useSwitchboardProvider(): { client: SwitchboardClient }`

## Sample

A runnable demo lives in [`samples/react-sample`](../../samples/react-sample).
