import { query } from '#convex/_generated/server.js';
import { getAuthUser } from './helpers';

export const currentUserQuery = query({
  args: {},
  handler: async (ctx) => {
    return getAuthUser(ctx)
  },
})
