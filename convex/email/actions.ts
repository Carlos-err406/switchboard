'use node'
import { internal } from '#convex/_generated/api.js'
import { internalAction } from '#convex/_generated/server.js'
import sendEmail from '#convex/email/send.js'
import { env } from '#convex/env.js'
import { v } from 'convex/values'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { inviteNotFound } from '../errors'

dayjs.extend(relativeTime)

export const sendInviteEmail = internalAction({
  args: {
    inviteId: v.id('invites'),
    inviteToken: v.string(),
  },
  handler: async (ctx, args) => {
    const invite = await ctx.runQuery(internal.invites.queries.getInvite, {
      id: args.inviteId,
    })
    if (!invite) throw inviteNotFound()
    await sendEmail({
      email: {
        template: 'invite',
        variables: {
          email: invite.toEmail,
          url: `${env.SITE_URL}/invite/${args.inviteToken}`,
          platformName: env.PLATFORM_NAME,
          orgName: env.ORG_NAME,
          invitedBy: invite.createdByEmail,
          expiresIn: dayjs(invite.expiresAt).fromNow(true),
        },
      },
      to: [invite.toEmail],
    })
  },
})

export const sendWelcomeEmail = internalAction({
  args: { to: v.string() },
  handler: async (_ctx, args) => {
    await sendEmail({
      email: {
        template: 'welcome',
        variables: {
          email: args.to,
          platformName: env.PLATFORM_NAME,
          orgName: env.ORG_NAME,
          url: env.SITE_URL,
        },
      },
      to: [args.to],
    })
  },
})

export const sendAccountLockedEmail = internalAction({
  args: { to: v.string() },
  handler: async (_ctx, args) => {
    await sendEmail({
      email: {
        template: 'account_locked',
        variables: {
          email: args.to,
          platformName: env.PLATFORM_NAME,
          orgName: env.ORG_NAME,
        },
      },
      to: [args.to],
    })
  },
})

export const sendAccountUnlockedEmail = internalAction({
  args: { to: v.string() },
  handler: async (_ctx, args) => {
    await sendEmail({
      email: {
        template: 'account_unlocked',
        variables: {
          email: args.to,
          platformName: env.PLATFORM_NAME,
          orgName: env.ORG_NAME,
          url: `${env.SITE_URL}/auth/signin`,
        },
      },
      to: [args.to],
    })
  },
})

export const sendPermissionsChangedEmail = internalAction({
  args: { to: v.string() },
  handler: async (_ctx, args) => {
    await sendEmail({
      email: {
        template: 'permissions_changed',
        variables: {
          email: args.to,
          platformName: env.PLATFORM_NAME,
          orgName: env.ORG_NAME,
        },
      },
      to: [args.to],
    })
  },
})

export const sendPasswordChangedEmail = internalAction({
  args: { to: v.string() },
  handler: async (_ctx, args) => {
    await sendEmail({
      email: {
        template: 'password_changed',
        variables: {
          email: args.to,
          platformName: env.PLATFORM_NAME,
          orgName: env.ORG_NAME,
        },
      },
      to: [args.to],
    })
  },
})
