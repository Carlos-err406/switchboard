import { v } from "convex/values";
import { authenticatedQuery } from "../lib/functions.js";
import { noPermission } from "../errors";
import type { Doc } from "../_generated/dataModel.js";
import type { QueryCtx } from "../_generated/server.js";

type DateRange = { startDate?: number; endDate?: number };

function byProjectId(
  ctx: QueryCtx,
  projectId: Doc<"auditLogs">["projectId"],
  { startDate, endDate }: DateRange,
) {
  const base = ctx.db.query("auditLogs").withIndex("by_project_id", (q) => {
    const eq = q.eq("projectId", projectId);
    if (startDate && endDate) return eq.gte("_creationTime", startDate).lte("_creationTime", endDate);
    if (startDate) return eq.gte("_creationTime", startDate);
    if (endDate) return eq.lte("_creationTime", endDate);
    return eq;
  });
  return base;
}

function byActor(
  ctx: QueryCtx,
  actor: Doc<"auditLogs">["actor"],
  { startDate, endDate }: DateRange,
) {
  return ctx.db.query("auditLogs").withIndex("by_actor", (q) => {
    const eq = q.eq("actor", actor);
    if (startDate && endDate) return eq.gte("_creationTime", startDate).lte("_creationTime", endDate);
    if (startDate) return eq.gte("_creationTime", startDate);
    if (endDate) return eq.lte("_creationTime", endDate);
    return eq;
  });
}

function byResource(
  ctx: QueryCtx,
  resource: string,
  { startDate, endDate }: DateRange,
) {
  return ctx.db.query("auditLogs").withIndex("by_resource", (q) => {
    const eq = q.eq("resource", resource);
    if (startDate && endDate) return eq.gte("_creationTime", startDate).lte("_creationTime", endDate);
    if (startDate) return eq.gte("_creationTime", startDate);
    if (endDate) return eq.lte("_creationTime", endDate);
    return eq;
  });
}

export const getAuditLogsQuery = authenticatedQuery({
  args: {
    action: v.optional(v.string()),
    resource: v.optional(v.string()),
    actor: v.optional(v.id("users")),
    projectId: v.optional(v.id("projects")),
    q: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (!ctx.user.permissions.includes("logs.list"))
      throw noPermission("list audit logs");

    const dateRange: DateRange = {
      startDate: args.startDate,
      endDate: args.endDate,
    };

    let baseQuery;
    if (args.projectId) {
      baseQuery = byProjectId(ctx, args.projectId, dateRange);
    } else if (args.actor) {
      baseQuery = byActor(ctx, args.actor, dateRange);
    } else if (args.resource) {
      baseQuery = byResource(ctx, args.resource, dateRange);
    } else {
      baseQuery = ctx.db.query("auditLogs");
    }

    const logs = await baseQuery.order("desc").collect();

    const search = args.q?.toLowerCase();

    return logs.filter((log) => {
      if (args.action && log.action !== args.action) return false;
      if (args.resource && log.resource !== args.resource) return false;
      if (args.actor && log.actor !== args.actor) return false;
      if (args.projectId && log.projectId !== args.projectId) return false;
      if (args.startDate && log._creationTime < args.startDate) return false;
      if (args.endDate && log._creationTime > args.endDate) return false;
      if (search && !log.message.toLowerCase().includes(search)) return false;
      return true;
    });
  },
});
