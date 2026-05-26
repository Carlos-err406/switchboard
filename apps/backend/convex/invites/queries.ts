import { internalQuery, query } from '../_generated/server.js'
import { authenticatedQuery } from '../lib/functions.js'
import { v } from 'convex/values'
import dayjs from 'dayjs'
import { noPermission, tokenAlreadyUsed, tokenExpired, tokenNotFound } from '../errors'
import { getInviteByToken } from './helpers'

export const getInviteByTokenQuery = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const invite = await getInviteByToken(ctx, { token: args.token })
    if (!invite) throw tokenNotFound()
    if (invite.used) throw tokenAlreadyUsed()
    if (dayjs().isAfter(dayjs(invite.expiresAt))) throw tokenExpired()
    return invite
  },
})

export const getInviteByTokenInternal = internalQuery({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    return await getInviteByToken(ctx, { token: args.token })
  },
})

export const getPendingInvitesQuery = authenticatedQuery({
  args: {},
  handler: async (ctx) => {
    if (!ctx.user.permissions.includes('users.list'))
      throw noPermission('list users')
    const invites = await ctx.db
      .query('invites')
      .order('desc')
      .collect()
    return invites.filter((i) => !i.used)
  },
})

export const getInvite = internalQuery({
  args: { id: v.id('invites') },
  handler: async (ctx, args) => {
    return ctx.db
      .query('invites')
      .withIndex('by_id', (q) => q.eq('_id', args.id))
      .unique()
  },
})
