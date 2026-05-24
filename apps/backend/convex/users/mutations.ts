import { internal } from '../_generated/api.js'
import { internalMutation, mutation } from '../_generated/server.js'
import { userPermissionValues } from '../schema/helpers.js'
import { v } from 'convex/values'
import { noPermission, notAuthenticated, userNotFound } from '../errors'
import { getAuthUser, getUserById } from './helpers'

export const deleteUserMutation = mutation({
  args: { id: v.id('users') },
  handler: async (ctx, args) => {
    const auth = await getAuthUser(ctx)
    if (!auth) throw notAuthenticated()
    if (!auth.permissions.includes('users.delete'))
      throw noPermission('delete users')
    const user = await getUserById(ctx, { id: args.id })
    if (!user) throw userNotFound()
    if (user.role === 'admin') throw noPermission('delete the admin')
    const accounts = await ctx.db
      .query('authAccounts')
      .withIndex('userIdAndProvider', (q) =>
        q.eq('userId', user._id).eq('provider', 'password'),
      )
      .collect()

    await Promise.all([
      ctx.db.delete('users', user._id),
      ...accounts.map((a) => ctx.db.delete('authAccounts', a._id)),
    ])
    await ctx.scheduler.runAfter(
      0,
      internal.users.actions.invalidateUserSessions,
      { userId: user._id },
    )
  },
})

export const updateUserMutation = mutation({
  args: {
    userId: v.id('users'),
    permissions: v.optional(userPermissionValues),
    locked: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const auth = await getAuthUser(ctx)
    if (!auth) throw notAuthenticated()
    if (!auth.permissions.includes('users.update'))
      throw noPermission('update users')
    const user = await getUserById(ctx, { id: args.userId })
    if (!user) throw userNotFound()
    if (user.role === 'admin') throw noPermission('update admin')
    const newPermissions =
      args.permissions === undefined ? user.permissions : args.permissions
    for (const perm of newPermissions) {
      if (!auth.permissions.includes(perm))
        throw noPermission(`update user to have ${perm}`)
    }

    const patchedUser: typeof user = {
      ...user,
      permissions: newPermissions,
      locked: args.locked !== undefined ? args.locked : user.locked,
    }
    await ctx.db.replace('users', user._id, patchedUser)

    if (args.permissions !== undefined) {
      const changed =
        args.permissions.length !== user.permissions.length ||
        args.permissions.some((p) => !user.permissions.includes(p))
      if (changed) {
        await ctx.scheduler.runAfter(
          0,
          internal.email.actions.sendPermissionsChangedEmail,
          { to: user.email },
        )
      }
    }

    if (args.locked !== undefined && args.locked !== user.locked) {
      const emailAction = args.locked
        ? internal.email.actions.sendAccountLockedEmail
        : internal.email.actions.sendAccountUnlockedEmail
      await ctx.scheduler.runAfter(0, emailAction, { to: user.email })
      if (args.locked) {
        await ctx.scheduler.runAfter(
          0,
          internal.users.actions.invalidateUserSessions,
          { userId: user._id },
        )
      }
    }
  },
})

export const updateAuthAccountSecret = internalMutation({
  args: { userId: v.id('users'), secret: v.string() },
  handler: async (ctx, args) => {
    const account = await ctx.db
      .query('authAccounts')
      .withIndex('userIdAndProvider', (q) =>
        q.eq('userId', args.userId).eq('provider', 'password'),
      )
      .unique()
    if (!account) throw userNotFound()
    await ctx.db.patch(account._id, { secret: args.secret })
    const user = await getUserById(ctx, { id: args.userId })
    if (user) {
      await ctx.scheduler.runAfter(
        0,
        internal.email.actions.sendPasswordChangedEmail,
        { to: user.email },
      )
    }
  },
})
