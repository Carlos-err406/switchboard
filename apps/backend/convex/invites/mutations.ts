import { v } from 'convex/values'
import { internal } from '../_generated/api.js'
import { internalMutation, mutation } from '../_generated/server.js'
import { noPermission, notAuthenticated, tokenNotFound } from '../errors'
import { generateToken, hashString } from '../helpers.js'
import { userPermissionValues } from '../schema/helpers.js'
import { getAuthUser } from '../users/helpers.js'

export const inviteUserMutation = mutation({
  args: { email: v.string(), permissions: userPermissionValues },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx)
    if (!user) throw notAuthenticated()
    if (!user.permissions.includes('users.invite'))
      throw noPermission('invite users')
    for (const permission of args.permissions) {
      if (!user.permissions.includes(permission))
        throw noPermission(`invite a user with ${permission}`)
    }
    const inviteToken = generateToken()
    const hashed = await hashString(inviteToken)
    await ctx.db.insert('invites', {
      createdBy: user._id,
      createdByEmail: user.email,
      hash: hashed,
      toEmail: args.email,
      permissions: args.permissions,
      used: false,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24,
    })

    await ctx.scheduler.runAfter(0, internal.email.actions.sendInviteEmail, {
      token: inviteToken,
    })
  },
})

export const markInviteAsUsed = internalMutation({
  args: { id: v.id('invites') },
  handler: async (ctx, args) => {
    const invite = await ctx.db.get(args.id)
    if (!invite) throw tokenNotFound()
    await ctx.db.patch(args.id, { used: true })
    await ctx.scheduler.runAfter(0, internal.email.actions.sendWelcomeEmail, {
      to: invite.toEmail,
    })
  },
})
