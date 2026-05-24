import { Button } from '@switchboard/ui/components/button'
import { useState } from 'react'
import { CodeBlock } from './code-block'

const CLIENT_TABS = [
  { key: 'react-ws', label: 'React · realtime', install: 'pnpm add @switchboard/react' },
  { key: 'node', label: 'Node.js', install: 'pnpm add @switchboard/node' },
  { key: 'vanilla', label: 'Vanilla JS', install: 'pnpm add @switchboard/js   # or via esm.sh' },
] as const

const REACT_WS_LEFT = `// 1. wrap your tree once
import { SwitchboardProvider } from "@switchboard/react";

export function App() {
  return (
    <SwitchboardProvider
      url="wss://flags.acme.io"
      apiKey={import.meta.env.VITE_SB_KEY}
      env="production"
    >
      <Routes />
    </SwitchboardProvider>
  );
}`

const REACT_WS_RIGHT = `// 2. read flags anywhere — they update live
import { useFlag } from "@switchboard/react";

export function Checkout() {
  const newCheckout = useFlag("new_checkout");

  return newCheckout
    ? <CheckoutV2 />
    : <CheckoutV1 />;
}

// flip it in the dashboard ─ the component re-renders
// across every connected tab. no refresh, no flicker.`

const NODE_LEFT = `// SSR / edge — no socket, just fetch
import { createClient } from "@switchboard/node";

const sb = createClient({
  url:    "https://flags.acme.io",
  apiKey: process.env.SB_KEY,
  env:    "production",
  cache:  "force-cache",
});

export default async function handler() {
  const { newCheckout } = await sb.flags([
    "newCheckout",
  ]);
  return newCheckout ? renderV2() : renderV1();
}`

const NODE_RIGHT = `// same shape, different transport.
// drop into Express, Hono, Fastify, or anything
// that can hold an HTTP client.

const { all } = await sb.flags("*");
console.log(all);
// {
//   new_checkout: true,
//   dark_mode_v2: false,
//   ai_assistant: true,
// }`

const VANILLA_LEFT = `// no framework, no build step
<script type="module">
  import { Switchboard }
    from "https://esm.sh/@switchboard/js";

  const sb = new Switchboard({
    url:    "wss://flags.acme.io",
    apiKey: "sk_live_...",
    env:    "production",
  });

  await sb.ready();
</script>`

const VANILLA_RIGHT = `// subscribe to any flag
sb.on("new_checkout", (on) => {
  document.body.classList.toggle(
    "checkout-v2", on,
  );
});

// or one-shot read
if (sb.get("ai_assistant")) {
  mountAssistant();
}

// reconnects automatically. ~2kb gzipped.`

const CODE_PANELS: Record<string, { left: string; right: string; lang: string }> = {
  'react-ws': { left: REACT_WS_LEFT, right: REACT_WS_RIGHT, lang: 'tsx' },
  'node': { left: NODE_LEFT, right: NODE_RIGHT, lang: 'typescript' },
  'vanilla': { left: VANILLA_LEFT, right: VANILLA_RIGHT, lang: 'javascript' },
}

export function ClientTabs() {
  const [active, setActive] = useState('react-ws')
  const [copied, setCopied] = useState(false)
  const currentTab = CLIENT_TABS.find((t) => t.key === active) ?? CLIENT_TABS[0]
  const panel = CODE_PANELS[active]

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(currentTab.install)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <div className="border border-foreground bg-white">
        {/* tab bar */}
        <div className="flex border-b border-foreground bg-secondary" role="tablist">
          {CLIENT_TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              type="button"
              aria-selected={active === t.key}
              onClick={() => setActive(t.key)}
              className={`relative cursor-pointer border-r border-foreground px-5 py-3.5 text-[13px] font-mono ${
                active === t.key
                  ? 'bg-white text-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-white'
                  : 'bg-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
          <div className="flex-1" />
        </div>

        {/* code panels — fixed height prevents layout shift between tabs */}
        {panel && (
          <div className="grid h-[380px] lg:grid-cols-2">
            <CodeBlock code={panel.left} language={panel.lang} />
            <CodeBlock code={panel.right} language={panel.lang} className="border-t border-foreground lg:border-t-0 lg:border-l" />
          </div>
        )}
      </div>

      <div className="mt-3.5 flex items-center justify-between border border-foreground bg-white px-3.5 py-2.5 text-xs">
        <code className="font-mono text-foreground">{currentTab.install}</code>
        <Button variant="outline" size="xs" onClick={copy}>
          {copied ? 'copied' : 'copy'}
        </Button>
      </div>
    </>
  )
}
