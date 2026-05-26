import { Button } from '@switchboard/ui/components/button'
import { useState } from 'react'
import { CodeBlock } from './code-block'

const CLIENT_TABS = [
  {
    key: 'react-ws',
    label: 'React · realtime',
    install: 'pnpm add @switchboard/react',
  },
  { key: 'edge', label: 'Edge / Node', install: 'pnpm add @switchboard/edge' },
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
      switchboardHost={import.meta.env.VITE_SB_HOST}
      apiKey={import.meta.env.VITE_SB_KEY}
    >
      <Routes />
    </SwitchboardProvider>
  );
}`

const REACT_WS_RIGHT = /* js */ `// 2. read flags anywhere — they update live
import { useFlag } from "@switchboard/react";

export function Checkout() {
  const variant = useFlag<"v1" | "v2">("checkout", "v1");

  return variant === "v2"
    ? <CheckoutV2 />
    : <CheckoutV1 />;
}

// flip it in the dashboard ─ the component re-renders
// across every connected tab. no refresh, no flicker.`

const EDGE_LEFT = /* typescript */ `// SSR / edge — same query, over HTTP
import { SwitchboardHttpClient } from "@switchboard/edge";

const client = new SwitchboardHttpClient({
  apiKey: process.env.SB_KEY,
  switchboardHost: "https://flags.acme.io",
  onError: (err) => console.error(err),
});

app.get("/checkout", async (req, res) => {
  const variant = await client.getFlag<"v1" | "v2">("checkout_variant", "v1");
  res.json({ checkout: variant });
});`

const EDGE_RIGHT = /* typescript */ `// flags can be string, number, boolean, or null
const dark = await client.getFlag("dark_mode", false);
const max  = await client.getFlag("max_items", 10);
const note = await client.getFlag<string | null>("banner");

// same query as the WebSocket client, just over HTTP.
// drop into Express, Hono, Fastify, Cloudflare Workers,
// or anything with a fetch-compatible runtime.`

const VANILLA_LEFT = /* html */ `<!-- no framework, no build step -->
<script type="module">
  import { SwitchboardWsClient } from "https://esm.sh/@switchboard/js";

  const client = new SwitchboardWsClient({
    url: "https://flags.acme.io",
    apiKey: "pk_...",
    onError: (err) => console.error(err),
  });

  // realtime — callback fires on every change
  client.on("ui_v2", (enabled) => {
    document.querySelector("#app").dataset.version =
      enabled ? "v2" : "v1";
  }, false);
</script>`

const VANILLA_RIGHT = /* javascript */ `// one-shot read with default
const max = await client.getFlag("max_items", 10);

// without default — throws on error
const banner = await client.getFlag("banner");

// subscribe to multiple flags
client.on("checkout_variant", (v) => {
  mountCheckout(v);
}, "v1");`

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
  edge: {
    left: EDGE_LEFT,
    right: EDGE_RIGHT,
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
