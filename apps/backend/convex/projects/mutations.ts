import { v } from "convex/values";
import { internal } from "../_generated/api.js";
import type { Doc } from "../_generated/dataModel.js";
import { mutationWithAudit } from "../lib/functions.js";
import { getProjectEnvironments } from "../environments/helpers.js";
import { getProjectFlags } from "../flags/helpers.js";
import { getProjectUser, getProjectUsers } from "../project_users/helpers.js";
import {
  noPermission,
  notAProjectMember,
  projectAlreadyExist,
  projectNotFound,
} from "../errors";
import { getProject, getProjectByName } from "./helpers";
import { PROJECT_USER_PERMISSIONS } from "../schema/helpers.js";

export const createProjectMutation = mutationWithAudit({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    if (!ctx.user.permissions.includes("projects.create"))
      throw noPermission("create projects");
    const existing = await getProjectByName(ctx, { name: args.name });
    if (existing) throw projectAlreadyExist();

    const inserted = await ctx.db.insert("projects", {
      ...args,
      createdBy: ctx.user._id,
    });
    await Promise.all([
      ctx.db.insert("projectUsers", {
        projectId: inserted,
        userId: ctx.user._id,
        permissions: [...PROJECT_USER_PERMISSIONS],
      }),

      ctx.db.insert("environments", {
        projectId: inserted,
        name: "Production",
      }),
    ]);

    ctx.audit.log({
      action: "created",
      resource: "project",
      resourceId: inserted,
      projectId: inserted,
      message: `${ctx.user.email} created project "${args.name}"`,
      metadata: { name: args.name },
    });

    return inserted;
  },
});

export const deleteProjectMutation = mutationWithAudit({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await getProject(ctx, args);
    if (!project) throw projectNotFound();

    const projectUser = await getProjectUser(ctx, {
      projectId: project._id,
      userId: ctx.user._id,
    });
    if (ctx.user.role !== "admin") {
      if (!projectUser) throw notAProjectMember();
      if (!projectUser.permissions.includes("project.delete"))
        throw noPermission("delete projects");
    }

    const [projectUsers, projectFlags, projectApiKeys, projectEnvironments] =
      await Promise.all([
        getProjectUsers(ctx, { id: project._id }),
        getProjectFlags(ctx, { id: project._id }),
        ctx.runQuery(internal.api_keys.helpers.getProjectApiKeys, {
          projectId: project._id,
        }),
        getProjectEnvironments(ctx, {
          id: project._id,
        }),
      ]);

    await Promise.all([
      ctx.db.delete(args.id),
      ...projectUsers.map((pu: Doc<"projectUsers">) => ctx.db.delete(pu._id)),
      ...projectFlags.map((pf: Doc<"flags">) => ctx.db.delete(pf._id)),
      ...projectEnvironments.map((pe: Doc<"environments">) =>
        ctx.db.delete(pe._id),
      ),
      ...projectApiKeys.map((ak: Doc<"apiKeys">) => ctx.db.delete(ak._id)),
    ]);

    ctx.audit.log({
      action: "deleted",
      resource: "project",
      resourceId: project._id,
      message: `${ctx.user.email} deleted project "${project.name}"`,
      metadata: { name: project.name },
    });
  },
});

export const renameProjectMutation = mutationWithAudit({
  args: { id: v.id("projects"), name: v.string() },
  handler: async (ctx, args) => {
    const [project, existing, projectUser] = await Promise.all([
      getProject(ctx, args),
      getProjectByName(ctx, { name: args.name }),
      getProjectUser(ctx, {
        projectId: args.id,
        userId: ctx.user._id,
      }),
    ]);

    if (!project) throw projectNotFound();
    if (!projectUser) throw notAProjectMember();
    if (!projectUser.permissions.includes("project.update"))
      throw noPermission("update projects");
    if (existing) throw projectAlreadyExist();
    await ctx.db.patch("projects", args.id, { name: args.name });

    ctx.audit.log({
      action: "updated",
      resource: "project",
      resourceId: project._id,
      projectId: project._id,
      message: `${ctx.user.email} renamed project "${project.name}" to "${args.name}"`,
      metadata: {
        "name.old": project.name,
        "name.new": args.name,
      },
    });
  },
});
