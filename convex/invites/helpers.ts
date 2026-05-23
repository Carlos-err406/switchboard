import type { DataModel } from '#convex/_generated/dataModel.js'
import { hashString } from '#convex/helpers.js'
import type { GenericQueryCtx } from 'convex/server'

export const getInviteByToken = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { token: string },
) => {
  const hash = await hashString(args.token)
  return await ctx.db
    .query('invites')
    .withIndex('by_hash', (q) => q.eq('hash', hash))
    .unique()
}
