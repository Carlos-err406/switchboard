import { v } from "convex/values";
import { mutationWithAudit } from "../lib/functions.js";
import { diffMetadata } from "../audit_logs/helpers.js";
import { getEnvironmentFlags } from "../flags/helpers.js";
import { getProjectUser } from "../project_users/helpers.js";
import { getProject } from "../projects/helpers.js";
import {
  cantDeleteTheLastEnvironment,
  environmentAlreadyExist,
  environmentNotFound,
  noPermission,
  notAProjectMember,
  projectNotFound,
} from "../errors";
import {
  getEnvironment,
  getEnvironmentByName,
  getProjectEnvironments,
} from "./helpers";

export const createEnvironmentMutation = mutationWithAudit({
  args: {
    projectId: v.id("projects"),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const [projectUser, project, existing] = await Promise.all([
      getProjectUser(ctx, {
        projectId: args.projectId,
        userId: ctx.user._id,
      }),
      getProject(ctx, { id: args.projectId }),
      getEnvironmentByName(ctx, {
        projectId: args.projectId,
        name: args.name,
      }),
    ]);
    if (!projectUser) throw notAProjectMember();
    if (!projectUser.permissions.includes("environment.create"))
      throw noPermission("create environments");
    if (!project) throw projectNotFound();
    if (existing) throw environmentAlreadyExist();

    const envId = await ctx.db.insert("environments", {
      projectId: args.projectId,
      name: args.name,
      description: args.description,
    });

    ctx.audit.log({
      action: "created",
      resource: "environment",
      resourceId: envId,
      projectId: args.projectId,
      message: `${ctx.user.email} created environment "${args.name}" in project "${project.name}"`,
      metadata: {
        name: args.name,
        project: project.name,
        ...(args.description ? { description: args.description } : {}),
      },
    });

    return envId;
  },
});

export const deleteEnvironmentMutation = mutationWithAudit({
  args: { environmentId: v.id("environments") },
  handler: async (ctx, args) => {
    const environment = await getEnvironment(ctx, { id: args.environmentId });
    if (!environment) throw environmentNotFound();

    const [projectUser, projectEnvironments, project, flags] =
      await Promise.all([
        getProjectUser(ctx, {
          projectId: environment.projectId,
          userId: ctx.user._id,
        }),
        getProjectEnvironments(ctx, { id: environment.projectId }),
        getProject(ctx, { id: environment.projectId }),
        getEnvironmentFlags(ctx, { id: environment._id }),
      ]);

    if (!project) throw projectNotFound();
    if (!projectUser) throw notAProjectMember();
    if (!projectUser.permissions.includes("environment.delete"))
      throw noPermission("delete environments");
    if (projectEnvironments.length === 1) throw cantDeleteTheLastEnvironment();

    await Promise.all([
      ctx.db.delete("environments", args.environmentId),
      ...flags.map((f) => ctx.db.delete("flags", f._id)),
    ]);

    ctx.audit.log({
      action: "deleted",
      resource: "environment",
      resourceId: environment._id,
      projectId: project._id,
      message: `${ctx.user.email} deleted environment "${environment.name}" from project "${project.name}"`,
      metadata: {
        name: environment.name,
        project: project.name,
        flagsDeleted: String(flags.length),
      },
    });
  },
});

export const updateEnvironmentMutation = mutationWithAudit({
  args: {
    environmentId: v.id("environments"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const environment = await getEnvironment(ctx, { id: args.environmentId });
    if (!environment) throw environmentNotFound();

    const [projectUser, project, existingName] = await Promise.all([
      getProjectUser(ctx, {
        projectId: environment.projectId,
        userId: ctx.user._id,
      }),
      getProject(ctx, { id: environment.projectId }),
      args.name !== undefined
        ? getEnvironmentByName(ctx, {
            projectId: environment.projectId,
            name: args.name,
          }).then(Boolean)
        : Promise.resolve(false),
    ]);

    if (existingName) throw environmentAlreadyExist();
    if (!project) throw projectNotFound();
    if (!projectUser) throw notAProjectMember();
    if (!projectUser.permissions.includes("environment.update"))
      throw noPermission("update environments");
    const updatedEnv: typeof environment = {
      ...environment,
      name: args.name !== undefined ? args.name : environment.name,
      description:
        args.description !== undefined
          ? args.description
          : environment.description,
    };
    await ctx.db.replace("environments", environment._id, updatedEnv);

    ctx.audit.log({
      action: "updated",
      resource: "environment",
      resourceId: environment._id,
      projectId: project._id,
      message: `${ctx.user.email} updated environment "${environment.name}" in project "${project.name}"`,
      metadata: {
        project: project.name,
        ...diffMetadata(environment, updatedEnv),
      },
    });
  },
});
