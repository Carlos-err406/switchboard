import { internalMutation } from './_generated/server'

export const cleanupDatabase = internalMutation({
  handler: async (ctx) => {
    const entries = await Promise.all([
      ctx.db.query('flags').collect(),
      ctx.db.query('apiKeys').collect(),
      ctx.db.query('environments').collect(),
      ctx.db.query('projectUsers').collect(),
      ctx.db.query('projects').collect(),
    ]).then((values) => values.flat())
    await Promise.all(entries.map((entry) => ctx.db.delete(entry._id)))
  },
})
export const cleanupFlags = internalMutation({
  handler: async (ctx) => {
    const flags = await ctx.db.query('flags').collect()
    await Promise.all([flags.map((flag) => ctx.db.delete(flag._id))])
  },
})
export const cleanupApiKeys = internalMutation({
  handler: async (ctx) => {
    const apiKeys = await ctx.db.query('apiKeys').collect()
    await Promise.all([apiKeys.map((apiKey) => ctx.db.delete(apiKey._id))])
  },
})
