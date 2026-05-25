export type LogEntry = { time: string; message: string }

export function Log({ entries }: { entries: LogEntry[] }) {
  return (
    <div className="p-4 bg-muted border border-border rounded-lg text-xs max-h-[200px] overflow-y-auto">
      {entries.length === 0 && (
        <span className="text-muted-foreground">waiting for events...</span>
      )}
      {entries.map((entry, i) => (
        <div key={i} className="py-0.5 border-b border-border last:border-b-0">
          [{entry.time}] {entry.message}
        </div>
      ))}
    </div>
  )
}
