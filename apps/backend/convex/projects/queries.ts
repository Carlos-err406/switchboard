import { query } from "../_generated/server.js";
import { getProjectEnvironments } from "../environments/helpers.js";
import { getEnvironmentFlags, getProjectFlags } from "../flags/helpers.js";
import {
  getProjectUser,
  getProjectUsers,
  getUserProjects,
} from "../project_users/helpers.js";
import { getAuthUser } from "../users/helpers.js";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import {
  notAProjectMember,
  notAuthenticated,
  projectNotFound,
} from "../errors";
import { getProject } from "./helpers";

export const getProjectsQuery = query({
  args: { q: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw notAuthenticated();

    const userProjects = await getUserProjects(ctx, { ...args, id: userId });

    const projects = await Promise.all(
      userProjects.map(async (userProject) => {
        const [project, environments, flags, projectMembers] =
          await Promise.all([
            getProject(ctx, { id: userProject.projectId }),
            getProjectEnvironments(ctx, { id: userProject.projectId }),
            getProjectFlags(ctx, { id: userProject.projectId }),
            getProjectUsers(ctx, { id: userProject.projectId }),
          ]);

        return project
          ? {
              ...project,
              permissions: userProject.permissions,
              environmentsCount: environments.length,
              flagsCount: flags.length,
              membersCount: projectMembers.length,
            }
          : null;
      }),
    );

    return projects.filter((p): p is NonNullable<typeof p> =>
      Boolean(p?.name.includes(args.q || "")),
    );
  },
});

export const getProjectQuery = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    if (!user) throw notAuthenticated();
    const [projectUser, project, environments] = await Promise.all([
      getProjectUser(ctx, {
        projectId: args.projectId,
        userId: user._id,
      }),
      getProject(ctx, { id: args.projectId }),
      getProjectEnvironments(ctx, {
        id: args.projectId,
      }),
    ]);

    if (!projectUser && user.role !== "admin") throw notAProjectMember();
    if (!project) throw projectNotFound();

    const richEnvironments = await Promise.all(
      environments.map(async (environment) => {
        const flags = await getEnvironmentFlags(ctx, { id: environment._id });
        return { ...environment, flags };
      }),
    );
    return {
      ...project,
      environments: richEnvironments as [
        (typeof richEnvironments)[number],
        ...typeof richEnvironments,
      ],
    };
  },
});

export const getProjectUserQuery = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    if (!user) throw notAuthenticated();
    const [project, projectUser] = await Promise.all([
      getProject(ctx, { id: args.projectId }),
      getProjectUser(ctx, { projectId: args.projectId, userId: user._id }),
    ]);
    if (!project) throw projectNotFound();
    if (!projectUser) throw notAProjectMember();
    return projectUser;
  },
});
