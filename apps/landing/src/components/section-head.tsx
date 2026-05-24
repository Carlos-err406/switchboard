export function SectionHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string
  title: string
  sub: string
}) {
  return (
    <div className="mb-12 flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted-foreground before:content-['*'] before:text-foreground">
          {eyebrow}
        </span>
        <h2 className="mt-2.5 max-w-[22ch] font-medium tracking-tight text-[clamp(28px,3.2vw,40px)] leading-tight">
          {title}
        </h2>
      </div>
      <p className="max-w-[42ch] text-muted-foreground lg:text-right">{sub}</p>
    </div>
  )
}
