# @switchboard/backend

The [Switchboard](https://github.com/Carlos-err406/switchboard) backend — a [Convex](https://www.convex.dev/) deployment that stores flags, authenticates SDK requests, and powers the dashboard. Designed to run on a **self-hosted** Convex instance.

## What it does

- Stores **projects → environments → flags**, plus API keys, users, invites, and audit logs.
- Exposes the SDK endpoint (`sdk.queries.getFlagQuery`) that every client reads flags through — authenticated by a `pk_`-prefixed API key scoped to one environment.
- Handles dashboard auth (email/password via [`@convex-dev/auth`](https://github.com/get-convex/convex-auth) + Lucia), invites, and password resets, sending email over SMTP.

## Layout

```
convex/
├── schema.ts            # auth tables + app tables
├── schema/tables.ts     # users, projects, environments, flags, apiKeys, invites, auditLogs, ...
├── auth.ts              # Convex auth config
├── http.ts              # HTTP routes / actions
├── sdk/queries.ts       # getFlagQuery — the public SDK endpoint
├── flags/               # flag queries & mutations
├── environments/        # environment queries & mutations
├── api_keys/            # API key issuance & validation
├── projects/            # project CRUD
├── project_users/       # per-project membership & permissions
├── invites/             # team invites
├── password_resets/     # password reset flow
├── audit_logs/          # audit trail
├── email/               # SMTP / nodemailer templates
└── env.ts               # validated server env (zod)
```

## Data model

| Table                        | Purpose                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------ |
| `flags`                      | `key`, `enabled`, optional `payload`, scoped to a `projectId` + `environmentId`.           |
| `environments`               | Named environments within a project (e.g. `development`, `production`).                    |
| `apiKeys`                    | `pk_` keys scoped to an environment, with `keyHash`, `keyPreview`, `expiresAt`, `enabled`. |
| `projects`                   | Top-level grouping for flags and environments.                                             |
| `users` / `projectUsers`     | Platform users and their per-project permissions.                                          |
| `invites` / `passwordResets` | Hashed, expiring tokens for onboarding and recovery.                                       |
| `auditLogs`                  | Actor, action, resource for every mutation.                                                |

## Local development

This app runs against a **self-hosted** Convex backend (see the root [`docker-compose.yaml`](../../docker-compose.yaml) and [`infra/docker-compose.yml`](infra/docker-compose.yml)).

### 1. Start the infrastructure

From the repo root:

```sh
docker compose up -d
```

This starts the Convex backend (`:3210` cloud/WS, `:3211` HTTP actions), the Convex dashboard (`:6791`), and maildev (`:1080`).

### 2. Configure env

```sh
cp .env.example .env.local
```

Then:

```sh
# generate the auth signing keys
node infra/generateKeys.mjs

# generate the self-hosted admin key
docker compose exec backend ./generate_admin_key.sh
```

### Environment variables

| Variable                         | Description                                                      |
| -------------------------------- | ---------------------------------------------------------------- |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Initial platform administrator credentials.                      |
| `SMTP_SERVER`                    | SMTP connection string (maildev locally).                        |
| `SMTP_FROM`                      | From address for outgoing email.                                 |
| `SITE_URL`                       | Dashboard URL used in email templates.                           |
| `ORG_NAME`                       | Organization name shown in emails (default `Your organization`). |
| `PLATFORM_NAME`                  | Platform name shown in emails (default `Switchboard`).           |
| `JWT_PRIVATE_KEY` / `JWKS`       | Auth signing keys — generate with `infra/generateKeys.mjs`.      |
| `CONVEX_SELF_HOSTED_URL`         | Self-hosted Convex deployment URL.                               |
| `CONVEX_SELF_HOSTED_ADMIN_KEY`   | Admin key from `generate_admin_key.sh`.                          |

> `env.ts` validates these with zod and refuses to start if any required value is missing.

### 3. Run

```sh
pnpm dev      # convex dev — pushes functions to the self-hosted deployment
# or from the repo root:
pnpm dev:backend
```

## Scripts

| Command       | Description                                              |
| ------------- | -------------------------------------------------------- |
| `pnpm dev`    | `convex dev` — watch & push functions to the deployment. |
| `pnpm deploy` | `convex deploy` — deploy functions.                      |
