import type { DataModel } from '#convex/_generated/dataModel.js'
import { getAuthUserId } from '@convex-dev/auth/server'
import type { GenericQueryCtx } from 'convex/server'

export const getAuthUser = async (ctx: GenericQueryCtx<DataModel>) => {
  const identity = await getAuthUserId(ctx)
  if (!identity) return null
  return await ctx.db
    .query('users')
    .withIndex('by_id', (q) => q.eq('_id', identity))
    .unique()
}
