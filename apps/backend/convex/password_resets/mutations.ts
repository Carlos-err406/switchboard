import { v } from "convex/values";
import { internal } from "../_generated/api.js";
import { internalMutation, mutation } from "../_generated/server.js";
import { tokenNotFound } from "../errors";
import { generateToken, hashString } from "../helpers.js";

export const createPasswordResetTokenMutation = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const passwordResetToken = generateToken();
    const hashed = await hashString(passwordResetToken);
    await ctx.db.insert("passwordResets", {
      hash: hashed,
      toEmail: args.email,
      used: false,
      expiresAt: Date.now() + 1000 * 60 * 10,
    });

    await ctx.scheduler.runAfter(
      0,
      internal.email.actions.sendResetPasswordEmail,
      {
        token: passwordResetToken,
        to: args.email,
      },
    );
  },
});

export const markPasswordResetAsUsed = internalMutation({
  args: { id: v.id("passwordResets") },
  handler: async (ctx, args) => {
    const reset = await ctx.db.get(args.id);
    if (!reset) throw tokenNotFound();
    await ctx.db.patch(args.id, { used: true });
  },
});

export const markInviteAsUsed = internalMutation({
  args: { id: v.id("invites") },
  handler: async (ctx, args) => {
    const invite = await ctx.db.get(args.id);
    if (!invite) throw tokenNotFound();
    await ctx.db.patch(args.id, { used: true });
    await ctx.scheduler.runAfter(0, internal.email.actions.sendWelcomeEmail, {
      to: invite.toEmail,
    });
  },
});
