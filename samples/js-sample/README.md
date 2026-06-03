# js-sample

A minimal vanilla-JS demo of [`@switchboard/js`](../../packages/js). Renders a table of flags that updates in realtime as you toggle them in the dashboard, plus a connection-status badge and a log.

## Run

Start the [backend](../../apps/backend) and create an API key in the [dashboard](../../apps/dashboard) first (see the [root README](../../README.md)).

```sh
cp .env.example .env.local
```

| Variable          | Description                                                |
| ----------------- | ---------------------------------------------------------- |
| `VITE_SB_API_KEY` | A `pk_` API key from the dashboard.                        |
| `VITE_SB_HOST`    | Switchboard backend URL (default `http://127.0.0.1:3210`). |

```sh
pnpm --filter js-sample dev
```

It subscribes to the `ui_v2`, `max_items`, and `banner` flags — create those (or edit the keys in `src/main.ts`) and toggle them in the dashboard to watch updates arrive.

## What it shows

- Constructing a `SwitchboardClient` with an `onError` handler.
- `client.on(key, callback)` for realtime subscriptions.
- `client.onConnectionChange(...)` for connection state.
