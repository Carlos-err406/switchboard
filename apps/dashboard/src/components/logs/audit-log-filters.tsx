import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@switchboard/ui/components/select'
import { AUDIT_ACTIONS, AUDIT_RESOURCES } from '@convex/audit_logs/helpers'
import { useNavigate, useSearch } from '@tanstack/react-router'
import type { FC } from 'react'

export const AuditLogFilters: FC = () => {
  const { action, resource } = useSearch({ from: '/(authenticated)/logs' })
  const navigate = useNavigate({ from: '/logs' })

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Select
        value={action ?? 'all'}
        onValueChange={(v) =>
          navigate({
            search: (prev) => ({
              ...prev,
              action: v === 'all' ? undefined : v,
            }),
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="All actions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All actions</SelectItem>
          {AUDIT_ACTIONS.map((a) => (
            <SelectItem key={a} value={a}>
              {a}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={resource ?? 'all'}
        onValueChange={(v) =>
          navigate({
            search: (prev) => ({
              ...prev,
              resource: v === 'all' ? undefined : v,
            }),
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="All resources" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All resources</SelectItem>
          {AUDIT_RESOURCES.map((r) => (
            <SelectItem key={r} value={r}>
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
