import { query } from '../_generated/server'
import { getAuthUser } from './helpers'

export const currentUserQuery = query({
  args: {},
  handler: async (ctx) => {
    return getAuthUser(ctx)
  },
})
