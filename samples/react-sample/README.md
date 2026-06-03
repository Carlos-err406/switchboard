# react-sample

A React demo of [`@switchboard/react`](../../packages/react). Shows a table of flags that re-render in realtime via `useFlag`, a connection badge via `useConnectionState`, and a log of updates.

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
pnpm --filter react-sample dev
```

It uses the `ui_v2`, `max_items`, and `banner` flags — create those in the dashboard and toggle them to watch the UI update.

## What it shows

- Wrapping the app in `<SwitchboardProvider>`.
- `useFlag<T>(key)` for subscribing to a flag in a component.
- `useConnectionState()` for the realtime connection badge.

## Scripts

| Command        | Description                   |
| -------------- | ----------------------------- |
| `pnpm dev`     | Run the dev server.           |
| `pnpm build`   | Production build.             |
| `pnpm preview` | Preview the production build. |
