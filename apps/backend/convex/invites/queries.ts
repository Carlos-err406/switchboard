import { internalQuery, query } from '../_generated/server.js'
import { v } from 'convex/values'
import dayjs from 'dayjs'
import { tokenAlreadyUsed, tokenExpired, tokenNotFound } from '../errors'
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

export const getInvite = internalQuery({
  args: { id: v.id('invites') },
  handler: async (ctx, args) => {
    return ctx.db
      .query('invites')
      .withIndex('by_id', (q) => q.eq('_id', args.id))
      .unique()
  },
})
