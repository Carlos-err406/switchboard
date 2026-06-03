import { Switch } from "@switchboard/ui/components/switch";
import { Flag } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ArchStep {
  num: string;
  label: string;
  title: string;
  desc: string;
}

const ARCH_STEPS: ArchStep[] = [
  {
    num: "01",
    label: "01 / mutation lands",
    title: "Admin flips a flag",
    desc: "The dashboard writes one mutation. The backend records it and fans it out to every subscriber on that environment.",
  },
  {
    num: "02",
    label: "02 / sockets receive",
    title: "Patch, not snapshot",
    desc: "Connected clients get just the diff — not the whole flag set. Bandwidth stays flat as the flag count grows.",
  },
  {
    num: "03",
    label: "03 / components react",
    title: "useFlag re-renders",
    desc: "Only the components that actually read the changed flag re-render. The rest of the tree is untouched.",
  },
  {
    num: "04",
    label: "04 / scale fallback",
    title: "HTTP polling or edge",
    desc: "Browser clients can switch to polling mode for high-traffic deploys. Edge runtimes use the same query over HTTP.",
  },
];

const ANIM_SELECTORS =
  ".arch-pulse-send, .arch-trunk-dot, .arch-pulse-core, .arch-fanout-master, .arch-child-dot, .arch-pulse-client";

function NodeCard({
  title,
  kind,
  items,
  footLeft,
  footRight,
  className = "",
}: {
  title: string;
  kind: string;
  items: string[];
  footLeft: string;
  footRight: string;
  className?: string;
}) {
  return (
    <div className={`border border-foreground bg-white p-5 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="inline-block size-1.5 bg-foreground" /> {title}
        </div>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {kind}
        </span>
      </div>
      <ul className="mt-3 grid list-none gap-1.5 p-0 text-[12.5px] text-muted-foreground">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-baseline gap-2 before:content-['·'] before:text-foreground"
          >
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex justify-between border-t border-dashed border-border pt-2.5 text-[10px] tracking-wider text-muted-foreground">
        <span>{footLeft}</span>
        <span>{footRight}</span>
      </div>
    </div>
  );
}

export function ArchDiagram() {
  const [sampleOn, setSampleOn] = useState(true);
  const diagramRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const restartAnim = useCallback(() => {
    const diagram = diagramRef.current;
    if (!diagram) return;
    diagram.querySelectorAll(ANIM_SELECTORS).forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.animation = "none";
      void htmlEl.offsetWidth;
      htmlEl.style.animation = "";
    });
  }, []);

  const flipSample = useCallback(() => {
    setSampleOn((prev) => !prev);
    restartAnim();
  }, [restartAnim]);

  const scheduleFlip = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(
      () => {
        if (!document.hidden) {
          flipSample();
        }
        scheduleFlip();
      },
      3000 + Math.random() * 2000,
    );
  }, [flipSample]);

  useEffect(() => {
    scheduleFlip();
    const onVisibility = () => {
      if (!document.hidden) scheduleFlip();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearTimeout(timerRef.current);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [scheduleFlip]);

  const handleManualFlip = () => {
    flipSample();
    scheduleFlip();
  };

  return (
    <div className="grid gap-8">
      <div
        ref={diagramRef}
        className="arch-diagram border border-foreground bg-white px-8 py-10"
      >
        {/* interactive sample card */}
        <aside className="arch-sample" aria-label="Trigger the flow">
          <div className="border border-foreground bg-white p-3.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="inline-block size-1.5 bg-foreground" /> Try it
              </div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                live
              </span>
            </div>
            <div className="mt-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-medium">
                <Flag className="size-3.5" />
                new_checkout
              </div>
              <Switch
                checked={sampleOn}
                onCheckedChange={handleManualFlip}
                aria-label="Toggle new_checkout"
              />
            </div>
            <div className="mt-2 text-[11px] tracking-wider text-muted-foreground">
              flip to trigger &rarr;
            </div>
          </div>
          <div className="sample-link" aria-hidden="true" />
        </aside>

        <div className="arch-tier-top">
          <NodeCard
            className="arch-pulse-send"
            title="Dashboard"
            kind="admin"
            items={[
              "Flip flags & payloads",
              "Environments & keys",
              "Members & audit log",
            ]}
            footLeft="web"
            footRight="https"
          />
        </div>

        <div className="arch-trunk">
          <span className="arch-trunk-label">mutation</span>
          <span className="arch-trunk-dot" />
        </div>

        <div className="arch-tier-mid">
          <NodeCard
            className="arch-pulse-core"
            title="Switchboard core"
            kind="server"
            items={[
              "Reactive database",
              "WebSocket gateway",
              "HTTP + WS query API",
              "Auth + RBAC + Audit log",
            ]}
            footLeft="ws"
            footRight="http"
          />
        </div>

        <div className="arch-fanout">
          <span className="arch-fanout-master" />
          <div className="arch-fanout-drops">
            <div className="arch-fanout-drop">
              <span className="arch-fanout-tag">ws</span>
            </div>
            <div className="arch-fanout-drop">
              <span className="arch-fanout-tag">ws</span>
            </div>
            <span className="arch-child-dot left" />
            <span className="arch-child-dot right" />
          </div>
        </div>

        <div className="arch-tier-bot grid grid-cols-2 gap-6">
          <NodeCard
            className="arch-pulse-client"
            title="React"
            kind="client"
            items={["useFlag hook", "Realtime or polling"]}
            footLeft="browser"
            footRight="ws / poll"
          />
          <NodeCard
            className="arch-pulse-client"
            title="Vanilla JS"
            kind="client"
            items={["~2kb gzipped", "sb.on(flag, cb)"]}
            footLeft="browser"
            footRight="ws / poll"
          />
        </div>

        <aside className="arch-aside">
          <div className="arch-aside-link" aria-hidden="true">
            <div className="arch-aside-line arch-aside-get">
              <span className="arch-aside-tag">GET</span>
            </div>
            <div className="arch-aside-line arch-aside-res">
              <span className="arch-aside-tag">200</span>
            </div>
          </div>
          <NodeCard
            title="Edge / SSR"
            kind="http"
            items={["Same query over HTTP", "Next, Remix, Workers, edge"]}
            footLeft="node / edge"
            footRight="http"
          />
        </aside>
      </div>

      <div className="grid grid-cols-1 gap-px border border-foreground bg-foreground sm:grid-cols-2 lg:grid-cols-4">
        {ARCH_STEPS.map((step) => (
          <div
            key={step.num}
            className="flex min-h-[170px] flex-col gap-2.5 bg-white p-5"
          >
            <span className="text-[11px] tracking-wider text-muted-foreground">
              {step.label}
            </span>
            <b className="text-sm font-medium">{step.title}</b>
            <p className="text-[12.5px] text-muted-foreground">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
