import { Badge } from "@switchboard/ui/components/badge";
import { api } from "@convex/_generated/api.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useQuery } from "convex/react";
import { useSearch } from "@tanstack/react-router";
import type { FC } from "react";
import { AuditLogFilters } from "./audit-log-filters";

dayjs.extend(relativeTime);

const ACTION_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  created: "default",
  updated: "secondary",
  deleted: "destructive",
  rotated: "secondary",
  invited: "default",
  locked: "destructive",
  unlocked: "default",
};

export const AuditLogList: FC = () => {
  const { q } = useSearch({ from: "__root__" });
  const { action, resource } = useSearch({ from: "/(authenticated)/logs" });

  const logs = useQuery(api.audit_logs.queries.getAuditLogsQuery, {
    q: q || undefined,
    action: action || undefined,
    resource: resource || undefined,
  });

  return (
    <div className="space-y-4">
      <AuditLogFilters />
      <div className="space-y-2">
        {logs?.length === 0 && (
          <p className="text-muted-foreground text-sm py-8 text-center">
            No audit logs found.
          </p>
        )}
        {logs?.map((log) => (
          <div
            key={log._id}
            className="flex items-start gap-3 border rounded-none p-3"
          >
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <p className="text-sm">{log.message}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={ACTION_VARIANTS[log.action] ?? "outline"}>
                  {log.action}
                </Badge>
                <Badge variant="outline">{log.resource}</Badge>
                <span className="text-xs text-muted-foreground">
                  {dayjs(log._creationTime).fromNow()}
                </span>
              </div>
              {log.metadata && Object.keys(log.metadata).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {Object.entries(log.metadata).map(([key, value]) => (
                    <span
                      key={key}
                      className="text-xs text-muted-foreground font-mono"
                    >
                      {key}={value}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
