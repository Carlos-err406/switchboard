# @switchboard/dashboard

The admin dashboard for [Switchboard](https://github.com/Carlos-err406/switchboard). Sign in, manage projects and environments, toggle flags, issue API keys, and invite teammates. Toggling a flag here is what connected SDK clients see in realtime.

Built with [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router), [TanStack Query](https://tanstack.com/query) over Convex, [Tailwind CSS](https://tailwindcss.com/), and [`@switchboard/ui`](../../packages/ui).

## What you can do

- **Projects & environments** — create projects and scope flags per environment.
- **Flags** — create flags, toggle `enabled`, set typed payloads, edit descriptions.
- **API keys** — issue `pk_` keys per environment, with previews and expiry.
- **Members** — invite users, manage per-project permissions.

## Layout

```
src/
├── router.tsx           # TanStack Router setup
├── routes/
│   ├── __root.tsx       # root layout
│   ├── auth/            # sign-in / password reset
│   ├── invite/          # invite acceptance
│   └── (authenticated)/ # projects, flags, environments, keys, members
├── components/          # dashboard UI
├── hooks/
├── integrations/        # Convex / query client wiring
└── lib/
```

## Local development

The dashboard talks to the [backend](../backend), so start the infrastructure and backend first (see the [root README](../../README.md)).

### 1. Configure env

```sh
cp .env.example .env.local
```

| Variable               | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| `VITE_CONVEX_URL`      | Convex backend URL (default `http://127.0.0.1:3210`).      |
| `VITE_CONVEX_SITE_URL` | Convex HTTP actions URL (default `http://127.0.0.1:3211`). |
| `VITE_LANDING_URL`     | URL of the landing site.                                   |

### 2. Run

```sh
# from the repo root — runs dashboard + backend together
pnpm dev

# or just the dashboard
pnpm --filter @switchboard/dashboard dev
```

Sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` configured in the backend env.

> Dev uses [`portless`](https://github.com/) to serve the app at a local `dashboard.switchboard` hostname.

## Scripts

| Command      | Description                               |
| ------------ | ----------------------------------------- |
| `pnpm dev`   | Run the dev server (via portless + Vite). |
| `pnpm build` | Production build (`vite build`).          |
