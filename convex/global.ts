import { internalMutation } from './_generated/server'

export const cleanupDatabase = internalMutation({
  handler: async (ctx) => {
    const entries = await Promise.all([
      ctx.db.query('users').collect(),
      ctx.db.query('authAccounts').collect(),
      ctx.db.query('authRateLimits').collect(),
      ctx.db.query('authRefreshTokens').collect(),
      ctx.db.query('authVerificationCodes').collect(),
      ctx.db.query('authSessions').collect(),
      ctx.db.query('authVerifiers').collect(),
      ctx.db.query('flags').collect(),
      ctx.db.query('apiKeys').collect(),
      ctx.db.query('environments').collect(),
      ctx.db.query('projectUsers').collect(),
      ctx.db.query('projects').collect(),
    ]).then((values) => values.flat())
    await Promise.all(entries.map((entry) => ctx.db.delete(entry._id)))
  },
})
