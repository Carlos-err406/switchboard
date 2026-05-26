import type { DataModel, Id } from "../_generated/dataModel.js";
import type { GenericQueryCtx } from "convex/server";

export const getProject = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { id: Id<"projects"> },
) => {
  return await ctx.db
    .query("projects")
    .withIndex("by_id", (q) => q.eq("_id", args.id))
    .unique();
};
export const getProjectByName = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { name: string },
) => {
  return await ctx.db
    .query("projects")
    .withIndex("by_name", (q) => q.eq("name", args.name))
    .unique();
};
