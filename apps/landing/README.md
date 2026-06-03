# @switchboard/landing

The marketing / landing site for [Switchboard](https://github.com/Carlos-err406/switchboard). A single-page site with an architecture diagram, SDK code samples, a live demo card, and self-hosting and contribution sections.

Built with [Vite](https://vite.dev/) + React, [Tailwind CSS](https://tailwindcss.com/), [`@switchboard/ui`](../../packages/ui), and [Prism](https://prismjs.com/) for syntax highlighting.

## Layout

```
src/
├── main.tsx
├── pages/home.tsx
└── components/
    ├── arch-diagram.tsx       # architecture diagram
    ├── client-tabs.tsx        # per-SDK code samples
    ├── code-block.tsx         # Prism-highlighted code
    ├── demo-card.tsx          # live flag demo
    ├── self-host-section.tsx
    ├── contribute-section.tsx
    ├── section-head.tsx
    └── landing-footer.tsx
```

## Local development

```sh
# from the repo root
pnpm dev:landing

# or directly
pnpm --filter @switchboard/landing dev
```

> Dev uses [`portless`](https://github.com/) to serve the app at a local `switchboard` hostname.

## Scripts

| Command        | Description                               |
| -------------- | ----------------------------------------- |
| `pnpm dev`     | Run the dev server (via portless + Vite). |
| `pnpm build`   | Production build (`vite build`).          |
| `pnpm preview` | Preview the production build.             |
