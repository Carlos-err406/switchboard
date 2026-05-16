import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  users: defineTable({
    auth_id: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal('user'), v.literal('admin')),
  })
    .index('email', ['email'])
    .index('auth_id', ['auth_id']),
  flags: defineTable({
    user_id: v.id('users'),
    name: v.string(),
    value: v.union(v.string(), v.number(), v.boolean(), v.null()),
    description: v.optional(v.string()),
  }).index('user_id', ['user_id']),
  api_keys: defineTable({
    user_id: v.id('users'),
    name: v.string(),
    value: v.string(),
    expires_at: v.nullable(v.string()),
    enabled: v.boolean(),
  }).index('user_id', ['user_id']),
})
