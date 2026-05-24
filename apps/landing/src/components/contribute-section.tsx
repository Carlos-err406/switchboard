import { Badge } from '@switchboard/ui/components/badge'
import { Button } from '@switchboard/ui/components/button'
import { CircleAlert, FileText } from 'lucide-react'
import { GitHubIcon, GITHUB_URL } from './github-icon'

export function ContributeSection() {
  return (
    <section id="contribute" className="py-24">
      <div className="grid items-center gap-8 border border-foreground bg-white p-7 lg:grid-cols-[1.2fr_.8fr] lg:gap-12 lg:p-12">
        <div>
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted-foreground before:content-['*'] before:text-foreground">
            contributing
          </span>
          <h2 className="mt-3.5 max-w-[18ch] font-medium tracking-tight text-[clamp(28px,3.2vw,40px)] leading-tight">
            MIT licensed. Contributors deeply appreciated.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Switchboard is a small open project run by a small group of humans. Bug reports,
            docs fixes, new client SDKs, design polish, translations &mdash; all welcome. Open an
            issue before you start anything big and we&rsquo;ll figure it out together.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="outline">MIT License</Badge>
            <Badge variant="outline">TypeScript 96%</Badge>
            <Badge variant="outline">good-first-issues open</Badge>
            <Badge variant="outline">no CLA</Badge>
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          <Button asChild>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              <GitHubIcon /> Open the repo
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={`${GITHUB_URL}/issues`} target="_blank" rel="noopener noreferrer">
              <CircleAlert className="size-3.5" />
              Browse issues
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={`${GITHUB_URL}/blob/main/README.md`} target="_blank" rel="noopener noreferrer">
              <FileText className="size-3.5" />
              Read the README
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
