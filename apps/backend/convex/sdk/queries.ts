import { v } from "convex/values";
import { query } from "../_generated/server";
import { internal } from "../_generated/api";
import {
  apiKeyDisabled,
  apiKeyExpired,
  apiKeyNotFound,
  flagNotFound,
} from "../errors";

export const getFlagQuery = query({
  args: { apiKey: v.string(), flagKey: v.string() },
  handler: async (ctx, args) => {
    const apiKey = await ctx.runQuery(
      internal.api_keys.queries.getApiKeyByValueQuery,
      { value: args.apiKey },
    );
    if (!apiKey) throw apiKeyNotFound();
    if (!apiKey.enabled) throw apiKeyDisabled();
    if (Date.now() >= (apiKey.expiresAt ?? Infinity)) throw apiKeyExpired();

    const flag = await ctx.runQuery(internal.flags.queries.getFlagByKeyQuery, {
      key: args.flagKey,
      environmentId: apiKey.environmentId,
    });
    if (!flag) throw flagNotFound();
    return { key: flag.key, enabled: flag.enabled, payload: flag.payload };
  },
});
