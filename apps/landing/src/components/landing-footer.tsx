import { Separator } from '@switchboard/ui/components/separator'
import { GITHUB_URL } from './github-icon'

export function LandingFooter() {
  return (
    <>
      <div className="mx-auto max-w-310 px-5 sm:px-8">
        <Separator />
        <footer className="grid grid-cols-2 gap-8 py-12 lg:grid-cols-[1.2fr_.9fr_.9fr_.9fr] lg:gap-12">
          <div>
            <div className="font-bold tracking-tight underline decoration-1 underline-offset-[3px]">
              Switchboard
            </div>
            <p className="mt-3 max-w-[32ch] text-muted-foreground">
              A self-hosted feature flag provider. Realtime, minimal, MIT.
            </p>
            <p className="mt-3.5 text-[11px] text-muted-foreground">
              &copy; 2026 &middot; made by humans
            </p>
          </div>
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Product
            </h4>
            <ul className="mt-3.5 grid list-none gap-2 p-0">
              <li>
                <a
                  href="#features"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#clients"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clients
                </a>
              </li>
              <li>
                <a
                  href="#architecture"
                  className="text-muted-foreground hover:text-foreground"
                >
                  How it works
                </a>
              </li>
              <li>
                <a
                  href="#selfhost"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Self-host
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Project
            </h4>
            <ul className="mt-3.5 grid list-none gap-2 p-0">
              <li>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={`${GITHUB_URL}/issues`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Issues
                </a>
              </li>
              <li>
                <a
                  href={`${GITHUB_URL}/blob/main/README.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  README
                </a>
              </li>
              <li>
                <a
                  href={`${GITHUB_URL}/blob/main/LICENSE`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  MIT License
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Built with
            </h4>
            <ul className="mt-3.5 grid list-none gap-2 p-0">
              <li>Convex</li>
              <li>TanStack Start</li>
              <li>React</li>
              <li>TypeScript</li>
            </ul>
          </div>
        </footer>
      </div>
      <div className="mx-auto flex max-w-310 justify-between border-t border-foreground px-5 py-4.5 text-[11px] text-muted-foreground sm:px-8">
        <span>switchboard / v0.1 / self-hosted</span>
        <span>* contributors appreciated</span>
      </div>
    </>
  )
}
