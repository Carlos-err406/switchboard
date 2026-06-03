# Switchboard

Self-hosted feature flags. A Convex-powered backend, an admin dashboard, and a set of SDKs for the browser, React, and edge/server runtimes.

Toggle a flag in the dashboard and connected clients update in realtime over a WebSocket — or poll over HTTP when you'd rather not hold a persistent connection.

## Features

- **Realtime flag updates** — flip a flag and subscribers see it instantly, no redeploy.
- **Projects → environments → flags** — organize flags per project, scope values per environment (e.g. `development`, `production`).
- **Scoped API keys** — one key per environment, with previews, expiry, and enable/disable.
- **Typed payloads** — every flag carries an `enabled` boolean plus an optional `string | number | boolean | null` payload.
- **Team management** — invites, per-project members, role and permission controls.
- **Audit logs** — every mutation is recorded with actor, action, and resource.
- **Self-hosted** — runs on a self-hosted Convex backend; you own the data.

## Repository layout

This is a pnpm + workspace monorepo.

| Path                                           | Package                  | Description                                                                 |
| ---------------------------------------------- | ------------------------ | --------------------------------------------------------------------------- |
| [`apps/backend`](apps/backend)                 | `@switchboard/backend`   | Convex backend — schema, auth, flag queries, the SDK endpoint.              |
| [`apps/dashboard`](apps/dashboard)             | `@switchboard/dashboard` | Admin dashboard (TanStack Start) for managing projects, flags, and members. |
| [`apps/landing`](apps/landing)                 | `@switchboard/landing`   | Marketing / landing site.                                                   |
| [`packages/common`](packages/common)           | `@switchboard/common`    | Shared types and helpers used by every SDK.                                 |
| [`packages/js`](packages/js)                   | `@switchboard/js`        | Browser/JS SDK — realtime (WebSocket) and poll (HTTP) transports.           |
| [`packages/react`](packages/react)             | `@switchboard/react`     | React provider and hooks on top of `@switchboard/js`.                       |
| [`packages/edge`](packages/edge)               | `@switchboard/edge`      | HTTP-only SDK for server and edge runtimes.                                 |
| [`packages/ui`](packages/ui)                   | `@switchboard/ui`        | Internal shared UI component library.                                       |
| [`samples/js-sample`](samples/js-sample)       | —                        | Vanilla JS demo of `@switchboard/js`.                                       |
| [`samples/react-sample`](samples/react-sample) | —                        | React demo of `@switchboard/react`.                                         |
| [`samples/edge-sample`](samples/edge-sample)   | —                        | Node/edge demo of `@switchboard/edge`.                                      |

## Architecture

```
┌─────────────┐         WebSocket / HTTP         ┌──────────────────┐
│  Your app   │ ───────────────────────────────▶ │  Convex backend  │
│  + SDK      │ ◀─────────────────────────────── │  (apps/backend)  │
└─────────────┘         flag updates              └──────────────────┘
                                                          ▲
                                                          │ manage flags,
                                                          │ keys, members
                                                  ┌───────────────┐
                                                  │   Dashboard   │
                                                  │ (apps/dashboard)
                                                  └───────────────┘
```

SDKs authenticate with a `pk_`-prefixed API key (scoped to one environment) and read flags through the backend's `sdk.queries.getFlagQuery` endpoint.

## Quick start (local development)

### Prerequisites

- Node `>=22 <23` (see [`.nvmrc`](.nvmrc) — `v22.22.2`)
- [pnpm](https://pnpm.io)
- Docker (for the self-hosted Convex backend and a local SMTP server)

### 1. Install

```sh
pnpm install
```

### 2. Start the infrastructure

This brings up the self-hosted Convex backend, the Convex dashboard, and [maildev](https://github.com/maildev/maildev) for catching auth emails:

```sh
docker compose up -d
```

| Service                          | URL                     |
| -------------------------------- | ----------------------- |
| Convex backend (cloud/WebSocket) | `http://127.0.0.1:3210` |
| Convex HTTP actions (site proxy) | `http://127.0.0.1:3211` |
| Convex dashboard                 | `http://127.0.0.1:6791` |
| Maildev inbox                    | `http://127.0.0.1:1080` |

### 3. Configure the backend

```sh
cp apps/backend/.env.example apps/backend/.env.local
```

Generate the auth keys and paste them into your env / the Convex dashboard:

```sh
node apps/backend/infra/generateKeys.mjs
```

Generate the admin key for the self-hosted deployment:

```sh
docker compose exec backend ./generate_admin_key.sh
```

See [`apps/backend/README.md`](apps/backend/README.md) for the full env reference.

### 4. Configure the dashboard

```sh
cp apps/dashboard/.env.example apps/dashboard/.env.local
```

### 5. Run

```sh
pnpm dev          # dashboard + backend (convex dev) together
pnpm dev:landing  # landing site
pnpm dev:backend  # backend only (convex dev)
```

`pnpm dev` pushes the backend functions to your self-hosted Convex instance and serves the dashboard. Sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you configured.

## Using a flag in your app

Install the SDK that fits your runtime:

```sh
npm install @switchboard/js      # browser, realtime + poll
npm install @switchboard/react   # React provider + hooks
npm install @switchboard/edge    # server / edge, HTTP only
```

Browser, realtime:

```ts
import { SwitchboardClient } from "@switchboard/js";

const client = new SwitchboardClient({
  apiKey: "pk_...",
  url: "https://flags.example.com",
});

client.on("new-checkout", ({ enabled, payload }) => {
  console.log("flag changed:", enabled, payload);
});
```

See each package's README for the full API. The [`samples/`](samples) directory has runnable demos for every SDK.

## Scripts

| Command            | Description                                      |
| ------------------ | ------------------------------------------------ |
| `pnpm dev`         | Run the dashboard and backend together.          |
| `pnpm dev:landing` | Run the landing site.                            |
| `pnpm dev:backend` | Run the backend (`convex dev`) only.             |
| `pnpm build`       | Build every workspace package (`pnpm -r build`). |
| `pnpm lint`        | Lint with ESLint.                                |
| `pnpm format`      | Format with Prettier.                            |
| `pnpm check`       | Check formatting without writing.                |

## Publishing

The public SDK packages (`common`, `js`, `edge`, `react`) are published to npm via the [`Publish Packages`](.github/workflows/publish.yml) GitHub Actions workflow (`workflow_dispatch`), which bumps versions, builds, and publishes the selected packages.

## License

[MIT](LICENSE) © 2026 Carlos Daniel Vilaseca Illnait
