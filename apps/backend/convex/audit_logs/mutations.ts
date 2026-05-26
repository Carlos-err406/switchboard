import { v } from "convex/values";
import { internalMutation } from "../_generated/server.js";

export const logAuditEvent = internalMutation({
  args: {
    actor: v.id("users"),
    action: v.string(),
    resource: v.string(),
    resourceId: v.string(),
    projectId: v.optional(v.id("projects")),
    message: v.string(),
    metadata: v.optional(v.record(v.string(), v.string())),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("auditLogs", args);
  },
});
