import { Switch } from '@switchboard/ui/components/switch'
import { Flag, RotateCw } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface DemoFlag {
  name: string
  on: boolean
  meta: string
}

const INITIAL_FLAGS: DemoFlag[] = [
  { name: 'new_checkout', on: true, meta: 'boolean · last changed 2s ago' },
  { name: 'dark_mode_v2', on: false, meta: 'boolean · 38% rollout' },
  { name: 'ai_assistant', on: true, meta: 'boolean · prod + staging' },
]

interface LogLine {
  id: number
  text: string
}

let logIdCounter = 0

export function DemoCard() {
  const [flags, setFlags] = useState(INITIAL_FLAGS)
  const [lines, setLines] = useState<LogLine[]>([])
  const demoRef = useRef<HTMLDivElement>(null)
  const pipeRef = useRef<HTMLDivElement>(null)
  const prevLinesId = useRef(0)

  const pushLog = useCallback((flag: string, val: string) => {
    const ts = new Date().toISOString().split('T')[1]?.replace('Z', '') ?? ''
    setLines((prev) =>
      [
        {
          id: ++logIdCounter,
          text: `[ws] ${ts}  flag.changed  ${flag} → ${val}`,
        },
        ...prev,
      ].slice(0, 3),
    )
  }, [])

  useEffect(() => {
    const pipe = pipeRef.current
    const topId = lines[0]?.id ?? 0
    if (!pipe || topId === prevLinesId.current) return
    prevLinesId.current = topId
    pipe.style.transition = 'none'
    pipe.style.transform = 'translateY(-18px)'
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        pipe.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        pipe.style.transform = 'translateY(0)'
      })
    })
  }, [lines])

  const flagsRef = useRef(flags)
  flagsRef.current = flags

  const toggle = useCallback(
    (index: number) => {
      const flag = flagsRef.current[index]
      const next = !flag.on
      setFlags((prev) =>
        prev.map((f, i) => (i === index ? { ...f, on: next } : f)),
      )
      pushLog(flag.name, String(next))
      demoRef.current?.animate(
        [
          { boxShadow: 'inset 0 0 0 0 #0a0a0a' },
          { boxShadow: 'inset 0 0 0 2px #0a0a0a' },
          { boxShadow: 'inset 0 0 0 0 #0a0a0a' },
        ],
        { duration: 420, easing: 'ease-out' },
      )
    },
    [pushLog],
  )

  useEffect(() => {
    const t1 = setTimeout(() => pushLog('ai_assistant', 'true'), 800)
    const t2 = setTimeout(() => pushLog('new_checkout', 'true'), 1500)

    const flagCount = INITIAL_FLAGS.length
    let lastToggled = -1
    let autoTimer: ReturnType<typeof setTimeout>
    function autoToggle() {
      if (!document.hidden) {
        const pool =
          flagCount > 1
            ? Array.from({ length: flagCount }, (_, i) => i).filter(
                (i) => i !== lastToggled,
              )
            : [0]
        const pick = pool[Math.floor(Math.random() * pool.length)] ?? 0
        toggle(pick)
        lastToggled = pick
      }
      autoTimer = setTimeout(autoToggle, 3000 + Math.random() * 2000)
    }
    const startTimer = setTimeout(autoToggle, 4000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(startTimer)
      clearTimeout(autoTimer)
    }
  }, [pushLog, toggle])

  return (
    <div
      ref={demoRef}
      className="grid grid-rows-[auto_1fr_auto] border border-foreground bg-white"
    >
      <div className="flex items-center gap-2.5 border-b border-foreground bg-secondary px-3.5 py-2.5 text-xs text-muted-foreground">
        <div className="flex gap-1.25">
          <span className="size-2 border border-foreground bg-white" />
          <span className="size-2 border border-foreground bg-white" />
          <span className="size-2 border border-foreground bg-white" />
        </div>
        <span>switchboard.localhost / acm / production</span>
      </div>

      <div className="p-4.5">
        <div className="border-b border-dashed border-border pb-3.5">
          {flags.map((f, i) => (
            <div
              key={f.name}
              className="mt-2 flex items-center justify-between gap-3 border border-foreground bg-white p-2.5 px-3 first:mt-0"
            >
              <div>
                <div className="flex items-center gap-2 font-medium">
                  <Flag className="size-3.5" />
                  {f.name}
                </div>
                <div className="mt-0.5 text-[11px] font-normal text-muted-foreground">
                  {f.meta}
                </div>
              </div>
              <Switch
                checked={f.on}
                onCheckedChange={() => toggle(i)}
                aria-label={`Toggle ${f.name}`}
              />
            </div>
          ))}
        </div>

        <div className="pt-3.5">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{'↳'} subscribers receive</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.75 rounded-full bg-[#13a36a] animate-[landing-pulse_1.6s_infinite]" />
              3 clients connected
            </span>
          </div>
          <div className="mt-1.5 min-h-13.5 overflow-hidden whitespace-pre-wrap break-all bg-foreground p-2.5 text-[11px] leading-normal text-white">
            <div ref={pipeRef}>
              {lines.length === 0 ? (
                <span className="text-muted-foreground">
                  {'// awaiting next change...'}
                </span>
              ) : (
                lines.map((ln) => {
                  const parts = ln.text.split(/(flag\.changed|\[ws\])/)
                  return (
                    <div key={ln.id}>
                      {parts.map((p, j) =>
                        p === '[ws]' ? (
                          <span key={j} className="text-[#9ae6b4]">
                            {p}
                          </span>
                        ) : p === 'flag.changed' ? (
                          <span key={j} className="text-[#7aa2f7]">
                            {p}
                          </span>
                        ) : (
                          <span key={j}>{p}</span>
                        ),
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-foreground bg-secondary px-3.5 py-2.5 text-[11px] text-muted-foreground">
        <span>ws://switchboard/projects/acm</span>
        <span className="flex items-center gap-1">
          <RotateCw className="size-2" /> try a switch
        </span>
      </div>
    </div>
  )
}
