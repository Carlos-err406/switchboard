import { query } from "../_generated/server.js";
import { getEnvironmentApiKeys } from "../api_keys/helpers.js";
import { getEnvironmentFlags } from "../flags/helpers.js";
import { getProjectUser } from "../project_users/helpers.js";
import { getProject } from "../projects/helpers.js";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import {
  notAProjectMember,
  notAuthenticated,
  projectNotFound,
} from "../errors";
import { getProjectEnvironments } from "./helpers";

export const getEnvironmentsQuery = query({
  args: { projectId: v.id("projects"), q: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw notAuthenticated();
    const [projectUser, project, environments] = await Promise.all([
      getProjectUser(ctx, {
        projectId: args.projectId,
        userId: userId,
      }),
      getProject(ctx, { id: args.projectId }),
      getProjectEnvironments(ctx, {
        id: args.projectId,
      }),
    ]);
    if (!projectUser) throw notAProjectMember();
    if (!project) throw projectNotFound();

    const filteredEnvs = environments.filter(
      (environment) =>
        environment.name.includes(args.q ?? "") ||
        environment.description?.includes(args.q ?? ""),
    );
    return await Promise.all(
      filteredEnvs.map(async (environment) => {
        const environmentFlags = await getEnvironmentFlags(ctx, {
          id: environment._id,
        });
        const environmentApiKeys = await getEnvironmentApiKeys(ctx, {
          id: environment._id,
        });
        return {
          ...environment,
          flagsCount: environmentFlags.length,
          apiKeysCount: environmentApiKeys.length,
        };
      }),
    );
  },
});
