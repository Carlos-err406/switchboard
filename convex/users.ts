import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getConvexUser, getUserByAuthId } from './helpers';

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return getConvexUser(ctx)
  },
})

export const createUser = mutation({
  args: {
    auth_id: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal('user'), v.literal('admin')),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert('users', args)
    return userId
  },
})

export const deleteUser = mutation({
  args: { auth_id: v.string() },
  handler: async (ctx, args) => {
    const user = await getUserByAuthId(ctx, args.auth_id)
    if (user) await ctx.db.delete('users', user._id)
  },
})
