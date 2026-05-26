import { AuditLogList } from '#/components/logs/audit-log-list.tsx'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)/logs/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-4">
      <h1>Audit Logs</h1>
      <AuditLogList />
    </div>
  )
}
