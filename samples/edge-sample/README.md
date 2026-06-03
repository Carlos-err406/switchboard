# edge-sample

A Node/edge demo of [`@switchboard/edge`](../../packages/edge). Fetches a set of flags over HTTP and prints their values — the kind of one-shot read you'd do server-side.

## Run

Start the [backend](../../apps/backend) and create an API key in the [dashboard](../../apps/dashboard) first (see the [root README](../../README.md)).

```sh
cp .env.example .env.local
```

| Variable     | Description                                                |
| ------------ | ---------------------------------------------------------- |
| `SB_API_KEY` | A `pk_` API key from the dashboard.                        |
| `SB_HOST`    | Switchboard backend URL (default `http://127.0.0.1:3211`). |

```sh
pnpm --filter edge-sample dev
```

It reads the `ui_v2`, `max_items`, and `banner` flags — create those in the dashboard (or edit the keys in `src/main.ts`).

## What it shows

- Constructing a `SwitchboardHttpClient`.
- `await client.getFlag(key)` for a one-shot HTTP read with `try/catch` error handling.
