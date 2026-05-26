import type { DataModel, Id } from "../_generated/dataModel.js";
import { internalQuery } from "../_generated/server.js";
import { hashString } from "../helpers.js";
import type { GenericQueryCtx } from "convex/server";
import { v } from "convex/values";

export const API_KEY_PREFIX = "pk";

export const getProjectApiKeys = internalQuery({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("apiKeys")
      .withIndex("by_project_id", (q) => q.eq("projectId", args.projectId))
      .collect();
  },
});

export const getApiKeyByName = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { environmentId: Id<"environments">; name: string },
) => {
  return await ctx.db
    .query("apiKeys")
    .withIndex("by_name_in_environment", (q) =>
      q.eq("environmentId", args.environmentId).eq("name", args.name),
    )
    .unique();
};

export const getApiKey = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { id: Id<"apiKeys"> },
) => {
  return await ctx.db
    .query("apiKeys")
    .withIndex("by_id", (q) => q.eq("_id", args.id))
    .unique();
};

export const getEnvironmentApiKeys = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { id: Id<"environments"> },
) => {
  return await ctx.db
    .query("apiKeys")
    .withIndex("by_environment_id", (q) => q.eq("environmentId", args.id))
    .collect();
};

export const getApiKeyByHash = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { hash: string },
) => {
  return ctx.db
    .query("apiKeys")
    .withIndex("by_key_hash", (q) => q.eq("keyHash", args.hash))
    .unique();
};

export const getApiKeyByValue = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { value: string },
) => {
  const hash = await hashString(args.value);
  return ctx.db
    .query("apiKeys")
    .withIndex("by_key_hash", (q) => q.eq("keyHash", hash))
    .unique();
};

export const getApiKeyPreview = (apiKey: string) =>
  apiKey.slice(0, 10) + "*".repeat(8) + apiKey.slice(-5);
