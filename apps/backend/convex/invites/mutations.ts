import { v } from 'convex/values'
import { internal } from '../_generated/api.js'
import { internalMutation } from '../_generated/server.js'
import { mutationWithAudit } from '../lib/functions.js'
import { noPermission, tokenNotFound } from '../errors'
import { generateToken, hashString } from '../helpers.js'
import { userPermissionValues } from '../schema/helpers.js'

export const inviteUserMutation = mutationWithAudit({
  args: { email: v.string(), permissions: userPermissionValues },
  handler: async (ctx, args) => {
    if (!ctx.user.permissions.includes('users.invite'))
      throw noPermission('invite users')
    for (const permission of args.permissions) {
      if (!ctx.user.permissions.includes(permission))
        throw noPermission(`invite a user with ${permission}`)
    }
    const inviteToken = generateToken()
    const hashed = await hashString(inviteToken)
    await ctx.db.insert('invites', {
      createdBy: ctx.user._id,
      createdByEmail: ctx.user.email,
      hash: hashed,
      toEmail: args.email,
      permissions: args.permissions,
      used: false,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24,
    })

    await ctx.scheduler.runAfter(0, internal.email.actions.sendInviteEmail, {
      token: inviteToken,
    })

    ctx.audit.log({
      action: 'invited',
      resource: 'invite',
      resourceId: args.email,
      message: `${ctx.user.email} invited "${args.email}"`,
      metadata: {
        toEmail: args.email,
        permissions: args.permissions.join(', '),
      },
    })
  },
})

export const resendInviteMutation = mutationWithAudit({
  args: { id: v.id('invites') },
  handler: async (ctx, args) => {
    if (!ctx.user.permissions.includes('users.invite'))
      throw noPermission('invite users')
    const invite = await ctx.db.get(args.id)
    if (!invite) throw tokenNotFound()

    await ctx.db.delete(args.id)

    const inviteToken = generateToken()
    const hashed = await hashString(inviteToken)
    await ctx.db.insert('invites', {
      createdBy: ctx.user._id,
      createdByEmail: ctx.user.email,
      hash: hashed,
      toEmail: invite.toEmail,
      permissions: invite.permissions,
      used: false,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24,
    })

    await ctx.scheduler.runAfter(0, internal.email.actions.sendInviteEmail, {
      token: inviteToken,
    })

    ctx.audit.log({
      action: 'invited',
      resource: 'invite',
      resourceId: invite.toEmail,
      message: `${ctx.user.email} resent invite to "${invite.toEmail}"`,
      metadata: { toEmail: invite.toEmail },
    })
  },
})

export const revokeInviteMutation = mutationWithAudit({
  args: { id: v.id('invites') },
  handler: async (ctx, args) => {
    if (!ctx.user.permissions.includes('users.invite'))
      throw noPermission('invite users')
    const invite = await ctx.db.get(args.id)
    if (!invite) throw tokenNotFound()

    await ctx.db.delete(args.id)

    ctx.audit.log({
      action: 'deleted',
      resource: 'invite',
      resourceId: invite.toEmail,
      message: `${ctx.user.email} revoked invite for "${invite.toEmail}"`,
      metadata: { toEmail: invite.toEmail },
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
