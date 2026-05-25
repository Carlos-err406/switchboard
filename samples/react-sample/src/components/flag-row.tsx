import { useFlag } from '@switchboard/react'
import { Badge } from '@switchboard/ui/components/badge'
import { Flag } from 'lucide-react'
import { useEffect, useRef } from 'react'

export function FlagRow({
  name,
  defaultValue,
  onUpdate,
}: {
  name: string
  defaultValue?: string | number | boolean | null
  onUpdate?: (name: string, value: unknown) => void
}) {
  const value = useFlag(name, defaultValue)
  const prev = useRef(value)

  useEffect(() => {
    if (prev.current !== value) {
      prev.current = value
      onUpdate?.(name, value)
    }
  }, [value, name, onUpdate])

  return (
    <tr className="border-b border-border">
      <td className="p-2.5 flex items-center gap-2">
        <Flag className="size-3.5 text-muted-foreground" />
        {name}
      </td>
      <td className="p-2.5">
        <code className="bg-muted px-1.5 py-0.5 text-xs">
          {String(defaultValue ?? 'undefined')}
        </code>
      </td>
      <td className="p-2.5">
        <code className="bg-muted px-1.5 py-0.5 text-xs">
          {String(value ?? 'undefined')}
        </code>
      </td>
      <td className="p-2.5">
        <Badge variant="outline">{typeof value}</Badge>
      </td>
    </tr>
  )
}
