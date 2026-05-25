import { Button } from '@switchboard/ui/components/button'
import { useState } from 'react'
import { CodeBlock } from './code-block'

const CLIENT_TABS = [
  {
    key: 'react-ws',
    label: 'React · realtime',
    install: 'pnpm add @switchboard/react',
  },
  { key: 'node', label: 'Node.js', install: 'pnpm add @switchboard/node' },
  {
    key: 'vanilla',
    label: 'Vanilla JS',
    install: 'pnpm add @switchboard/js   # or via esm.sh',
  },
] as const

const REACT_WS_LEFT = /* js */ `// 1. wrap your tree once
import { SwitchboardProvider } from "@switchboard/react";

export function App() {
  return (
    <SwitchboardProvider
      url="wss://flags.acme.io"
      apiKey={import.meta.env.VITE_SB_KEY}
    >
      <Routes />
    </SwitchboardProvider>
  );
}`

const REACT_WS_RIGHT = /* js */ `// 2. read flags anywhere — they update live
import { useFlag } from "@switchboard/react";

export function Checkout() {
  const newCheckout = useFlag("new_checkout");

  return newCheckout
    ? <CheckoutV2 />
    : <CheckoutV1 />;
}

// flip it in the dashboard ─ the component re-renders
// across every connected tab. no refresh, no flicker.`

const NODE_LEFT = /* typescript */ `// SSR / edge — no socket, just fetch
import { SwitchboardHttpClient } from "@switchboard/node";

const client = new SwitchboardHttpClient({
  apiKey: process.env.SB_KEY,
  switchboardHost: "https://flags.acme.io",
  onError: (err) => console.error(err),
});

app.get("/checkout", async (req, res) => {
  const variant = await client.getFlag<"v1" | "v2">("checkout_variant", "v1");
  res.json({ checkout: variant });
});`

const NODE_RIGHT = /* typescript */ `// flags can be string, number, boolean, or null
const dark = await client.getFlag("dark_mode", false);
const max  = await client.getFlag("max_items", 10);
const note = await client.getFlag<string | null>("banner");

// drop into Express, Hono, Fastify, or anything
// that can hold an HTTP client.
// flags are fetched per-call, no socket needed.`

const VANILLA_LEFT = /* html */ `<!-- no framework, no build step -->
<script type="module">
  import { Switchboard } from "https://esm.sh/@switchboard/js";

  const sb = new Switchboard({
    url: "wss://flags.acme.io",
    apiKey: "pk_live_...",
    env: "production",
  });

  await sb.ready();
</script>`

const VANILLA_RIGHT = /* javascript */ `// subscribe to any flag
sb.on("new_checkout", (on) => {
  document.body.classList.toggle("checkout-v2", on);
});

// or one-shot read
if (sb.get("ai_assistant")) {
  mountAssistant();
}

// reconnects automatically. ~2kb gzipped.`

const CODE_PANELS: Record<
  string,
  { left: string; right: string; langLeft: string; langRight: string }
> = {
  'react-ws': {
    left: REACT_WS_LEFT,
    right: REACT_WS_RIGHT,
    langLeft: 'tsx',
    langRight: 'tsx',
  },
  node: {
    left: NODE_LEFT,
    right: NODE_RIGHT,
    langLeft: 'typescript',
    langRight: 'typescript',
  },
  vanilla: {
    left: VANILLA_LEFT,
    right: VANILLA_RIGHT,
    langLeft: 'html',
    langRight: 'javascript',
  },
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
        <div
          className="flex border-b border-foreground bg-secondary"
          role="tablist"
        >
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

        <div className="grid h-[380px] lg:grid-cols-2">
          <CodeBlock code={panel.left} language={panel.langLeft} />
          <CodeBlock
            code={panel.right}
            language={panel.langRight}
            className="border-t border-foreground lg:border-t-0 lg:border-l"
          />
        </div>
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
