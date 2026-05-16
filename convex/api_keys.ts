import { getManyFrom } from 'convex-helpers/server/relationships';
import { query } from './_generated/server';
import { getConvexUser } from './helpers';

export const getUserApiKeys = query({
  args: {},
  handler: async (ctx) => {
    const user = await getConvexUser(ctx)
    if (!user) return null
    return getManyFrom(ctx.db, 'api_keys', 'user_id', user._id)
  },
})
