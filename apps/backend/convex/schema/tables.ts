import { defineTable } from "convex/server";
import { v } from "convex/values";
import {
  projectUserPermissionValues,
  userPermissionValues,
  userRoleValues,
} from "./helpers";

export const users = defineTable({
  email: v.string(),
  emailVerificationTime: v.optional(v.number()),
  role: userRoleValues,
  permissions: userPermissionValues,
  locked: v.boolean(),
}).index("email", ["email"]);

export const projects = defineTable({
  name: v.string(),
}).index("by_name", ["name"]);

export const projectUsers = defineTable({
  projectId: v.id("projects"),
  userId: v.id("users"),
  permissions: projectUserPermissionValues,
})
  .index("by_project_id", ["projectId"])
  .index("by_user_id", ["userId"])
  .index("by_project_user", ["projectId", "userId"]);

export const flags = defineTable({
  key: v.string(),
  environmentId: v.id("environments"),
  projectId: v.id("projects"),
  value: v.union(v.string(), v.number(), v.boolean(), v.null()),
  description: v.optional(v.string()),
  enabled: v.boolean(),
})
  .index("by_project_id", ["projectId"])
  .index("by_environment_id", ["environmentId"])
  .index("by_project_environment", ["projectId", "environmentId"])
  .index("by_environment_flag_key", ["environmentId", "key"]);

export const environments = defineTable({
  projectId: v.id("projects"),
  description: v.optional(v.string()),
  name: v.string(),
})
  .index("by_project_id", ["projectId"])
  .index("by_name", ["name"])
  .index("by_name_in_project", ["projectId", "name"]);

export const apiKeys = defineTable({
  projectId: v.id("projects"),
  environmentId: v.id("environments"),
  name: v.string(),
  description: v.optional(v.string()),
  keyHash: v.string(),
  keyPreview: v.string(),
  expiresAt: v.nullable(v.number()),
  enabled: v.boolean(),
  createdBy: v.id("users"),
  lastUsedAt: v.nullable(v.number()),
})
  .index("by_key_hash", ["keyHash"])
  .index("by_environment_id", ["environmentId"])
  .index("by_project_id", ["projectId"])
  .index("by_name_in_environment", ["environmentId", "name"]);

export const invites = defineTable({
  hash: v.string(),
  createdBy: v.id("users"),
  createdByEmail: v.string(),
  toEmail: v.string(),
  expiresAt: v.number(),
  used: v.boolean(),
  permissions: userPermissionValues,
})
  .index("by_hash", ["hash"])
  .index("by_creator", ["createdBy"])
  .index("by_expiration_date", ["expiresAt"])
  .index("by_creator_email", ["createdByEmail"]);

export const passwordResets = defineTable({
  hash: v.string(),
  expiresAt: v.number(),
  used: v.boolean(),
  toEmail: v.string(),
})
  .index("by_hash", ["hash"])
  .index("by_expiration_date", ["expiresAt"]);

export const auditLogs = defineTable({
  actor: v.id("users"),
  action: v.string(),
  resource: v.string(),
  resourceId: v.string(),
  projectId: v.optional(v.id("projects")),
  message: v.string(),
  metadata: v.optional(v.record(v.string(), v.string())),
})
  .index("by_project_id", ["projectId"])
  .index("by_actor", ["actor"])
  .index("by_resource", ["resource"]);
