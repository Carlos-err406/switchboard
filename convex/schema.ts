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
        v.literal('member.invite'),
        v.literal('member.remove'),
      ),
    ),
  }).index('email', ['email']),

  projects: defineTable({
    name: v.string(),
  }).index('name', ['name']),

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
        v.literal('member.invite'),
        v.literal('member.remove'),
      ),
    ),
  })
    .index('projectId', ['projectId'])
    .index('userId', ['userId'])
    .index('projectUser', ['projectId', 'userId']),

  flags: defineTable({
    projectId: v.id('projects'),
    name: v.string(),
    description: v.optional(v.string()),
  }).index('projectId', ['projectId']),

  flagValues: defineTable({
    flagId: v.id('flags'),
    environmentId: v.id('environments'),
    value: v.union(v.string(), v.number(), v.boolean(), v.null()),
    enabled: v.boolean(),
  })
    .index('flagId', ['flagId'])
    .index('environmentFlag', ['environmentId', 'flagId']),

  environments: defineTable({
    projectId: v.id('projects'),
    name: v.string(), // "production", "staging", "development"
  }).index('projectId', ['projectId']),

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
    .index('projectId', ['projectId'])
    .index('keyHash', ['keyHash']),
})
