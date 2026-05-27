import { internalQuery, query } from "../_generated/server.js";
import { getEnvironment } from "../environments/helpers.js";
import { getProject } from "../projects/helpers.js";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import {
  environmentNotFound,
  flagNotFound,
  notAProjectMember,
  notAuthenticated,
  projectNotFound,
} from "../errors";
import { getFlag, getFlagByKey, getFlags } from "./helpers";
import { getProjectUser } from "../project_users/helpers.js";

export const getFlagsQuery = query({
  args: {
    environmentId: v.id("environments"),
    q: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw notAuthenticated();

    const environment = await getEnvironment(ctx, { id: args.environmentId });
    if (!environment) throw environmentNotFound();
    const [project, projectUser] = await Promise.all([
      getProject(ctx, { id: environment.projectId }),
      getProjectUser(ctx, {
        projectId: environment.projectId,
        userId: userId,
      }),
    ]);

    if (!project) throw projectNotFound();
    if (!projectUser) throw notAProjectMember();

    const flags = await getFlags(ctx, {
      environmentId: environment._id,
    });
    const searchQuery = args.q?.toLowerCase() ?? "";
    return flags.filter(
      (flag) =>
        flag.key.toLowerCase().includes(searchQuery) ||
        flag.description?.toLowerCase().includes(searchQuery) ||
        String(flag.payload).toLowerCase().includes(searchQuery),
    );
  },
});

export const getFlagByKeyQuery = internalQuery({
  args: {
    environmentId: v.id("environments"),
    key: v.string(),
  },
  handler: async (ctx, args) => {
    const environment = await getEnvironment(ctx, { id: args.environmentId });
    if (!environment) throw environmentNotFound();
    const flag = await getFlagByKey(ctx, {
      environmentId: environment._id,
      key: args.key,
    });
    return flag;
  },
});
