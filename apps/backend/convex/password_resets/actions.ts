import { v } from 'convex/values'
import { Scrypt } from 'lucia'
import { internal } from '../_generated/api.js'
import { action } from '../_generated/server.js'
import { tokenAlreadyUsed, tokenExpired, tokenNotFound } from '../errors'

export const resetPasswordWithTokenAction = action({
  args: {
    token: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const passwordReset = await ctx.runQuery(
      internal.password_resets.queries.getPasswordResetByTokenInternal,
      { token: args.token },
    )
    if (!passwordReset) throw tokenNotFound()
    if (passwordReset.used) throw tokenAlreadyUsed()
    if (Date.now() > passwordReset.expiresAt) throw tokenExpired()

    const user = await ctx.runQuery(internal.users.queries.getUserByEmail, {
      email: passwordReset.toEmail,
    })
    if (!user) throw tokenNotFound()

    const secret = await new Scrypt().hash(args.newPassword)
    await ctx.runMutation(internal.users.mutations.updateAuthAccountSecret, {
      userId: user._id,
      secret,
    })

    await ctx.runMutation(
      internal.password_resets.mutations.markPasswordResetAsUsed,
      { id: passwordReset._id },
    )

    await ctx.scheduler.runAfter(
      0,
      internal.email.actions.sendPasswordChangedEmail,
      { to: passwordReset.toEmail },
    )
  },
})
