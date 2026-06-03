# @switchboard/ui

Internal shared UI component library for the [Switchboard](https://github.com/Carlos-err406/switchboard) apps. Built on [Radix UI](https://www.radix-ui.com/), [Tailwind CSS](https://tailwindcss.com/), and [shadcn](https://ui.shadcn.com/)-style primitives.

> **Private package** — not published to npm. Consumed by `@switchboard/dashboard`, `@switchboard/landing`, and `@switchboard/react-sample` via the workspace.

## Usage

Import components from the `components/*` subpath, and the stylesheet once at your app's entry:

```tsx
import "@switchboard/ui/styles.css";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@switchboard/ui/components/card";

function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello</CardTitle>
      </CardHeader>
      <CardContent>…</CardContent>
    </Card>
  );
}
```

## What's inside

- Radix-based primitives wrapped with `class-variance-authority` and `tailwind-merge`.
- Icons via [`lucide-react`](https://lucide.dev/).
- Toasts via [`sonner`](https://sonner.emilkowal.ski/).
- Theming via [`next-themes`](https://github.com/pacocoursey/next-themes).
- Date picking via [`react-day-picker`](https://react-day-picker.js.org/).

Peer dependencies: `react` and `react-dom` `^19`.
