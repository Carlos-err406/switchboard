import { internalQuery, query } from "../_generated/server.js";
import { getEnvironment } from "../environments/helpers.js";
import { getProjectUser } from "../project_users/helpers.js";
import { getProject } from "../projects/helpers.js";
import { getUserById } from "../users/helpers.js";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import {
  environmentNotFound,
  notAProjectMember,
  notAuthenticated,
  projectNotFound,
} from "../errors";
import { getApiKeyByValue, getEnvironmentApiKeys } from "./helpers";

export const getApiKeysQuery = query({
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

    const apiKeys = await getEnvironmentApiKeys(ctx, {
      id: args.environmentId,
    });
    return await Promise.all(
      apiKeys.map(async (apiKey) => ({
        ...apiKey,
        creatorEmail: await getUserById(ctx, { id: apiKey.createdBy }).then(
          (user) => user?.email,
        ),
      })),
    );
  },
});

export const getApiKeyByValueQuery = internalQuery({
  args: { value: v.string() },
  handler: async (ctx, args) => {
    return getApiKeyByValue(ctx, args);
  },
});
