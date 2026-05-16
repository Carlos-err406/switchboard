import { getManyFrom } from 'convex-helpers/server/relationships';
import { query } from './_generated/server';
import { getConvexUser } from './helpers';

export const getUserFlags = query({
  handler: async (ctx) => {
    const user = await getConvexUser(ctx)
    if (!user) return null
    return getManyFrom(ctx.db, 'flags', 'user_id', user._id)
  },
})
