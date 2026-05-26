import type { GenericQueryCtx } from "convex/server";
import type { DataModel } from "../_generated/dataModel.js";
import { hashString } from "../helpers.js";

export const getPasswordResetByToken = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { token: string },
) => {
  const hash = await hashString(args.token);
  return await ctx.db
    .query("passwordResets")
    .withIndex("by_hash", (q) => q.eq("hash", hash))
    .unique();
};
