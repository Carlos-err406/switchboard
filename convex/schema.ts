import { authTables } from '@convex-dev/auth/server'
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  ...authTables,
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    role: v.union(v.literal('admin'), v.literal('member')),
    permissions: v.array(
      v.union(
        v.literal('project.create'),
        v.literal('user.invite'),
        v.literal('user.delete'),
      ),
    ),
  }).index('by_email', ['email']),

  projects: defineTable({
    name: v.string(),
  }).index('by_name', ['name']),

  projectUsers: defineTable({
    projectId: v.id('projects'),
    userId: v.id('users'),
    permissions: v.array(
      v.union(
        v.literal('project.update'),
        v.literal('project.delete'),
        v.literal('flag.create'),
        v.literal('flag.update'),
        v.literal('flag.delete'),
        v.literal('api_key.create'),
        v.literal('api_key.update'),
        v.literal('api_key.delete'),
        v.literal('environment.create'),
        v.literal('environment.update'),
        v.literal('environment.delete'),
        v.literal('member.add'),
        v.literal('member.remove'),
      ),
    ),
  })
    .index('by_project_id', ['projectId'])
    .index('by_user_id', ['userId'])
    .index('by_project_user', ['projectId', 'userId']),

  flags: defineTable({
    key: v.string(),
    environmentId: v.id('environments'),
    projectId: v.id('projects'),
    value: v.union(v.string(), v.number(), v.boolean(), v.null()),
    enabled: v.boolean(),
  })
    .index('by_project_id', ['projectId'])
    .index('by_environment_id', ['environmentId']),

  environments: defineTable({
    projectId: v.id('projects'),
    name: v.string(),
  })
    .index('by_project_id', ['projectId'])
    .index('by_name', ['name']),

  apiKeys: defineTable({
    projectId: v.id('projects'),
    environmentId: v.id('environments'),
    name: v.string(),
    keyHash: v.string(),
    keyPrefix: v.string(), // "sk_live_abc..." for display
    expiresAt: v.optional(v.number()),
    enabled: v.boolean(),
    createdBy: v.id('users'),
  })
    .index('by_project_id', ['projectId'])
    .index('by_key_hash', ['keyHash']),
})
