import { GITHUB_URL } from './github-icon'
import { CodeBlock } from './code-block'
import { SectionHead } from './section-head'

const SETUP_STEPS: { title: string; desc: React.ReactNode }[] = [
  {
    title: 'Clone the repo',
    desc: 'One command, no submodules. Bring node 20+ and pnpm.',
  },
  {
    title: 'Configure .env',
    desc: (
      <>
        Set <code className="font-mono">CONVEX_URL</code>,{' '}
        <code className="font-mono">AUTH_SECRET</code>, and the admin email.
        That&rsquo;s it.
      </>
    ),
  },
  {
    title: 'docker compose up',
    desc: 'Brings up Convex, the dashboard, and the websocket gateway behind a single port.',
  },
  {
    title: 'Create a project & key',
    desc: 'Sign in, create your first project + environment, mint an API key, point your client at it.',
  },
]

const TERMINAL_CODE = `# clone
$ git clone ${GITHUB_URL}
$ cd switchboard

# configure
$ cp .env.example .env
$ $EDITOR .env

# run
$ docker compose up -d
✓ convex      started on  :3210
✓ dashboard   started on  :5173
✓ websocket   listening on :5174

# open the dashboard
$ open https://switchboard.localhost`

export function SelfHostSection() {
  return (
    <section id="selfhost" className="border-b border-foreground py-24">
      <SectionHead
        eyebrow="self-host"
        title="Bring your own server. We'll bring the dashboard."
        sub="Switchboard is self-hosted only — by design. Your flag data never leaves your network."
      />
      <div className="grid items-start gap-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-12">
        <ol className="mt-4.5 grid list-none gap-4.5 p-0">
          {SETUP_STEPS.map((step, i) => (
            <li
              key={i}
              className="grid grid-cols-[auto_1fr] items-start gap-3.5"
            >
              <span className="border border-foreground px-1.75 py-0.75 text-[11px] leading-none text-muted-foreground">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <b className="font-medium">{step.title}</b>
                <p className="mt-1 text-[12.5px] text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <CodeBlock
          code={TERMINAL_CODE}
          language="bash"
          className="border border-foreground bg-[#0a0a0a]! text-[#e6e6e6]!"
        />
      </div>
    </section>
  )
}
