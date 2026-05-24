import { internalQuery, query } from '../_generated/server.js'
import { v } from 'convex/values'
import { noPermission, notAuthenticated } from '../errors'
import { getAuthUser, getUsers } from './helpers'

export const currentUserQuery = query({
  handler: async (ctx) => {
    return getAuthUser(ctx)
  },
})

export const getUsersQuery = query({
  args: { q: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx)
    if (!user) throw notAuthenticated()
    if (!user.permissions.includes('users.list'))
      throw noPermission('list users')

    const users = await getUsers(ctx)
    const searchQuery = args.q?.toLowerCase() ?? ''
    return users.filter((u) => u.email.toLowerCase().includes(searchQuery))
  },
})

export const getUser = internalQuery({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return ctx.db.get(args.userId)
  },
})

export const getUserByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), args.email))
      .unique()
  },
})

export const getAuthAccount = internalQuery({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return ctx.db
      .query('authAccounts')
      .withIndex('userIdAndProvider', (q) =>
        q.eq('userId', args.userId).eq('provider', 'password'),
      )
      .unique()
  },
})
