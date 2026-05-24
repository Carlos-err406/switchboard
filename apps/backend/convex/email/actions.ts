'use node'
import { internal } from '../_generated/api.js'
import { internalAction } from '../_generated/server.js'
import sendEmail from '../email/send.js'
import { env } from '../env.js'
import { v } from 'convex/values'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { tokenNotFound } from '../errors'

dayjs.extend(relativeTime)

export const sendInviteEmail = internalAction({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const invite = await ctx.runQuery(
      internal.invites.queries.getInviteByTokenInternal,
      { token: args.token },
    )
    if (!invite) throw tokenNotFound()
    await sendEmail({
      email: {
        template: 'invite',
        variables: {
          email: invite.toEmail,
          url: `${env.SITE_URL}/invite/${args.token}`,
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

export const sendResetPasswordEmail = internalAction({
  args: {
    token: v.string(),
    to: v.string(),
  },
  handler: async (ctx, args) => {
    const passwordReset = await ctx.runQuery(
      internal.password_resets.queries.getPasswordResetByTokenInternal,
      {
        token: args.token,
      },
    )
    if (!passwordReset) throw tokenNotFound()
    await sendEmail({
      email: {
        template: 'forgot_password',
        variables: {
          email: passwordReset.toEmail,
          expiresIn: dayjs(passwordReset.expiresAt).fromNow(true),
          url: `${env.SITE_URL}/auth/reset-password/${args.token}`,
          platformName: env.PLATFORM_NAME,
          orgName: env.ORG_NAME,
        },
      },
      to: [args.to],
    })
  },
})
