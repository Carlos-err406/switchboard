import { internal } from '../_generated/api.js'
import { action, internalAction } from '../_generated/server.js'
import { invalidateSessions, getAuthUserId  } from '@convex-dev/auth/server'
import { Scrypt } from 'lucia'
import { v } from 'convex/values'
import { noPermission, notAuthenticated, userNotFound } from '../errors'
import { mutationError } from '../errors/helpers'

export const invalidateUserSessions = internalAction({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    await invalidateSessions(ctx, { userId: args.userId })
  },
})

export const changeUserPasswordAction = action({
  args: {
    userId: v.id('users'),
    newPassword: v.string(),
    oldPassword: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const authId = await getAuthUserId(ctx)
    if (!authId) throw notAuthenticated()

    const isSelf = authId === args.userId

    if (isSelf) {
      if (!args.oldPassword)
        throw mutationError({ oldPassword: ['Current password is required'] })
      const account = await ctx.runQuery(
        internal.users.queries.getAuthAccount,
        { userId: args.userId },
      )
      if (!account?.secret) throw userNotFound()
      const valid = await new Scrypt().verify(account.secret, args.oldPassword)
      if (!valid)
        throw mutationError({ oldPassword: ['Current password is incorrect'] })
    } else {
      const auth = await ctx.runQuery(internal.users.queries.getUser, {
        userId: authId,
      })
      if (!auth) throw notAuthenticated()
      if (auth.role !== 'admin')
        throw noPermission("change other users' passwords")
      const target = await ctx.runQuery(internal.users.queries.getUser, {
        userId: args.userId,
      })
      if (!target) throw userNotFound()
      if (target.role === 'admin') throw noPermission('change admin password')
    }

    const secret = await new Scrypt().hash(args.newPassword)
    await ctx.runMutation(internal.users.mutations.updateAuthAccountSecret, {
      userId: args.userId,
      secret,
    })
  },
})
