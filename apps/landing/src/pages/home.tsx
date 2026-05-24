import { Button } from '@switchboard/ui/components/button'
import {
  Code2,
  Globe,
  Grid3X3,
  Monitor,
  RefreshCw,
  Shield,
  Zap,
} from 'lucide-react'
import { ArchDiagram } from '../components/arch-diagram'
import { ClientTabs } from '../components/client-tabs'
import { ContributeSection } from '../components/contribute-section'
import { DemoCard } from '../components/demo-card'
import { GitHubIcon, GITHUB_URL } from '../components/github-icon'
import { LandingFooter } from '../components/landing-footer'
import { SectionHead } from '../components/section-head'
import { SelfHostSection } from '../components/self-host-section'

interface Feature {
  icon: React.ReactNode
  num: string
  title: string
  desc: string
}

const FEATURES: Feature[] = [
  {
    icon: <Zap className="size-5.5" strokeWidth={1.6} />,
    num: '01 / realtime',
    title: 'WebSocket updates',
    desc: 'Clients subscribe once. Toggles propagate in <100ms. No polling, no stale flags, no reload loops.',
  },
  {
    icon: <Grid3X3 className="size-5.5" strokeWidth={1.6} />,
    num: '02 / multi-env',
    title: 'Environments & projects',
    desc: 'Production, staging, dev, or your own. Scoped API keys per environment. Promote flags across with one click.',
  },
  {
    icon: <Globe className="size-5.5" strokeWidth={1.6} />,
    num: '03 / convex',
    title: 'Convex backend',
    desc: 'Reactive database that does the heavy lifting. Sockets, auth, sync, and audit log out of the box.',
  },
  {
    icon: <Shield className="size-5.5" strokeWidth={1.6} />,
    num: '04 / RBAC',
    title: 'Members & permissions',
    desc: 'Admins and members. Per-project membership. Granular permissions for create / view / invite / delete.',
  },
  {
    icon: <RefreshCw className="size-5.5" strokeWidth={1.6} />,
    num: '05 / server-ready',
    title: 'HTTP client too',
    desc: "For SSR, jobs, and edge runtimes that can't hold a socket. Same SDK, cached, no realtime needed.",
  },
  {
    icon: <Monitor className="size-5.5" strokeWidth={1.6} />,
    num: '06 / self-hosted',
    title: 'Self-hosted only',
    desc: 'One docker-compose up. Your data stays on your boxes. No SaaS tier, no upsell email, no rate limit.',
  },
]

export function Home() {
  return (
    <div className="landing bg-white text-foreground">
      {/* nav */}
      <nav className="sticky top-0 z-30 border-b border-foreground bg-white/92 backdrop-blur-md backdrop-saturate-[1.4]">
        <div className="mx-auto flex max-w-310 items-center gap-8 px-5 py-4.5 sm:px-8">
          <a
            href="#"
            className="font-bold tracking-tight underline decoration-1 underline-offset-[3px]"
          >
            Switchboard
          </a>
          <div className="ml-6 hidden gap-6 text-muted-foreground sm:flex">
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
            <a href="#clients" className="hover:text-foreground">
              Clients
            </a>
            <a href="#architecture" className="hover:text-foreground">
              How it works
            </a>
            <a href="#selfhost" className="hover:text-foreground">
              Self-host
            </a>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm" asChild>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                <GitHubIcon /> Repo
              </a>
            </Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-310 px-5 sm:px-8">
        {/* hero */}
        <section className="relative overflow-hidden border-b border-foreground py-20">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'radial-gradient(#0a0a0a 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              mask: 'linear-gradient(180deg, transparent 0%, #000 30%, #000 60%, transparent 100%)',
              WebkitMask:
                'linear-gradient(180deg, transparent 0%, #000 30%, #000 60%, transparent 100%)',
            }}
          />
          <div className="relative z-1 grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
            <div>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted-foreground before:content-['*'] before:text-foreground">
                v0.1 &middot; self-hosted feature flags
              </span>
              <h1
                className="mt-4.5 font-medium tracking-tight text-foreground text-[clamp(40px,5.4vw,72px)] leading-none"
                style={{ textWrap: 'balance' }}
              >
                Flip a flag:
                <br />
                your app reacts in
                <br />
                <span className="underline decoration-1 underline-offset-[6px]">
                  real-time
                </span>
                .
              </h1>
              <p className="mt-5.5 max-w-[48ch] text-base leading-normal text-muted-foreground">
                Switchboard is a minimal, self-hosted feature flag provider.
                WebSocket-based, backed by Convex, with first-class React and
                vanilla JS clients. No vendors, no quotas, no tracking pixels.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <a href="#selfhost">
                    <Code2 className="size-3.5" />
                    Self-host in 60 seconds
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GitHubIcon /> Star on GitHub
                  </a>
                </Button>
              </div>
              <div className="mt-9 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span>realtime</span>
                <span>&middot;</span>
                <span>websocket</span>
                <span>&middot;</span>
                <span>convex backend</span>
                <span>&middot;</span>
                <span>react + vanilla js</span>
                <span>&middot;</span>
                <span>MIT</span>
              </div>
            </div>
            <DemoCard />
          </div>
        </section>

        {/* features */}
        <section id="features" className="border-b border-foreground py-24">
          <SectionHead
            eyebrow="what's inside"
            title="A small set of sharp tools, not a 200-page platform."
            sub="Built for teams who want flags without an enterprise contract or a tracking pipeline pointed at their users."
          />
          <div className="grid grid-cols-1 gap-px border border-foreground bg-foreground sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.num}
                className="flex min-h-50 flex-col gap-2.5 bg-white p-6"
              >
                {f.icon}
                <span className="text-[11px] tracking-wider text-muted-foreground">
                  {f.num}
                </span>
                <h3 className="mt-0.5 text-lg font-medium">{f.title}</h3>
                <p className="text-[13px] text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* clients */}
        <section id="clients" className="border-b border-foreground py-24">
          <SectionHead
            eyebrow="clients"
            title="Three drop-ins. One mental model."
            sub="Pick the client that fits the runtime. They all read the same flags and respect the same environment scoping."
          />
          <ClientTabs />
        </section>

        {/* architecture */}
        <section id="architecture" className="border-b border-foreground py-24">
          <SectionHead
            eyebrow="how it works"
            title="One socket. One source of truth."
            sub="Convex pushes mutations to subscribed clients. Switchboard sits on top with auth, scopes, and a small dashboard."
          />
          <ArchDiagram />
        </section>

        <SelfHostSection />
        <ContributeSection />
      </main>

      <LandingFooter />
    </div>
  )
}
