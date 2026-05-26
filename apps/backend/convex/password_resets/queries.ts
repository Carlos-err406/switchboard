import { internalQuery, query } from "../_generated/server.js";
import { v } from "convex/values";
import dayjs from "dayjs";
import { tokenAlreadyUsed, tokenExpired, tokenNotFound } from "../errors";
import { getPasswordResetByToken } from "./helpers";

export const getPasswordResetByTokenQuery = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const passwordReset = await getPasswordResetByToken(ctx, {
      token: args.token,
    });
    if (!passwordReset) throw tokenNotFound();
    if (passwordReset.used) throw tokenAlreadyUsed();
    if (dayjs().isAfter(dayjs(passwordReset.expiresAt))) throw tokenExpired();
    return passwordReset;
  },
});

export const getPasswordResetByTokenInternal = internalQuery({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    return await getPasswordResetByToken(ctx, { token: args.token });
  },
});

export const getPasswordReset = internalQuery({
  args: { id: v.id("passwordResets") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("passwordResets")
      .withIndex("by_id", (q) => q.eq("_id", args.id))
      .unique();
  },
});
