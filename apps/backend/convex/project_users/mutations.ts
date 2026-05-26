import { v } from "convex/values";
import { internal } from "../_generated/api.js";
import { mutationWithAudit } from "../lib/functions.js";
import { diffMetadata } from "../audit_logs/helpers.js";
import { projectUserPermissionValues } from "../schema/helpers.js";
import { getProject } from "../projects/helpers.js";
import { getUserById } from "../users/helpers.js";
import {
  cantModifyProjectOwner,
  cantRemoveLastManager,
  cantRemoveLastMember,
  noPermission,
  notAProjectMember,
  projectNotFound,
  userNotFound,
} from "../errors";
import { MEMBER_MANAGEMENT_PERMISSIONS } from "../schema/helpers.js";
import { getProjectUser, getProjectUsers } from "./helpers";

export const addProjectMemberMutation = mutationWithAudit({
  args: {
    projectId: v.id("projects"),
    userId: v.id("users"),
    permissions: projectUserPermissionValues,
  },
  handler: async (ctx, args) => {
    const [project, callerMembership, targetUser, existingMembership] =
      await Promise.all([
        getProject(ctx, { id: args.projectId }),
        getProjectUser(ctx, {
          projectId: args.projectId,
          userId: ctx.user._id,
        }),
        getUserById(ctx, { id: args.userId }),
        getProjectUser(ctx, {
          projectId: args.projectId,
          userId: args.userId,
        }),
      ]);

    if (!project) throw projectNotFound();
    if (!callerMembership) throw notAProjectMember();
    if (!callerMembership.permissions.includes("member.add"))
      throw noPermission("add members");
    if (!targetUser) throw userNotFound();
    if (existingMembership)
      throw new Error("User is already a member of this project");

    for (const perm of args.permissions) {
      if (!callerMembership.permissions.includes(perm))
        throw noPermission(`grant ${perm}`);
    }

    const memberId = await ctx.db.insert("projectUsers", {
      projectId: args.projectId,
      userId: args.userId,
      permissions: args.permissions,
    });

    await ctx.scheduler.runAfter(
      0,
      internal.email.actions.sendProjectMemberAddedEmail,
      {
        to: targetUser.email,
        projectName: project.name,
        addedBy: ctx.user.email,
      },
    );

    ctx.audit.log({
      action: "created",
      resource: "project_user",
      resourceId: memberId,
      projectId: args.projectId,
      message: `${ctx.user.email} added "${targetUser.email}" to project "${project.name}"`,
      metadata: {
        email: targetUser.email,
        project: project.name,
        permissions: args.permissions.join(", "),
      },
    });
  },
});

export const removeProjectMemberMutation = mutationWithAudit({
  args: { id: v.id("projectUsers") },
  handler: async (ctx, args) => {
    const membership = await ctx.db.get(args.id);
    if (!membership) throw notAProjectMember();

    const [project, callerMembership, targetUser] = await Promise.all([
      getProject(ctx, { id: membership.projectId }),
      getProjectUser(ctx, {
        projectId: membership.projectId,
        userId: ctx.user._id,
      }),
      getUserById(ctx, { id: membership.userId }),
    ]);

    if (!project) throw projectNotFound();
    if (!callerMembership) throw notAProjectMember();
    if (!callerMembership.permissions.includes("member.remove"))
      throw noPermission("remove members");
    if (!targetUser) throw userNotFound();
    if (project.createdBy === membership.userId) throw cantModifyProjectOwner();

    const allMembers = await getProjectUsers(ctx, { id: membership.projectId });
    if (allMembers.length <= 1) throw cantRemoveLastMember();

    const isManager = MEMBER_MANAGEMENT_PERMISSIONS.every((p) =>
      membership.permissions.includes(p),
    );
    if (isManager) {
      const otherManagers = allMembers.filter(
        (m) =>
          m._id !== args.id &&
          MEMBER_MANAGEMENT_PERMISSIONS.every((p) => m.permissions.includes(p)),
      );
      if (otherManagers.length === 0) throw cantRemoveLastManager();
    }

    await ctx.db.delete(args.id);

    await ctx.scheduler.runAfter(
      0,
      internal.email.actions.sendProjectMemberRemovedEmail,
      { to: targetUser.email, projectName: project.name },
    );

    ctx.audit.log({
      action: "deleted",
      resource: "project_user",
      resourceId: args.id,
      projectId: project._id,
      message: `${ctx.user.email} removed "${targetUser.email}" from project "${project.name}"`,
      metadata: {
        email: targetUser.email,
        project: project.name,
      },
    });
  },
});

export const updateProjectMemberPermissionsMutation = mutationWithAudit({
  args: {
    id: v.id("projectUsers"),
    permissions: projectUserPermissionValues,
  },
  handler: async (ctx, args) => {
    const membership = await ctx.db.get(args.id);
    if (!membership) throw notAProjectMember();

    const [project, callerMembership, targetUser] = await Promise.all([
      getProject(ctx, { id: membership.projectId }),
      getProjectUser(ctx, {
        projectId: membership.projectId,
        userId: ctx.user._id,
      }),
      getUserById(ctx, { id: membership.userId }),
    ]);

    if (!project) throw projectNotFound();
    if (!callerMembership) throw notAProjectMember();
    if (!callerMembership.permissions.includes("member.update"))
      throw noPermission("update member permissions");
    if (!targetUser) throw userNotFound();
    if (project.createdBy === membership.userId) throw cantModifyProjectOwner();

    for (const perm of args.permissions) {
      if (
        !membership.permissions.includes(perm) &&
        !callerMembership.permissions.includes(perm)
      )
        throw noPermission(`grant ${perm}`);
    }
    for (const perm of membership.permissions) {
      if (
        !args.permissions.includes(perm) &&
        !callerMembership.permissions.includes(perm)
      )
        throw noPermission(`revoke ${perm}`);
    }

    const wasManager = MEMBER_MANAGEMENT_PERMISSIONS.every((p) =>
      membership.permissions.includes(p),
    );
    const stillManager = MEMBER_MANAGEMENT_PERMISSIONS.every((p) =>
      args.permissions.includes(p),
    );
    if (wasManager && !stillManager) {
      const allMembers = await getProjectUsers(ctx, {
        id: membership.projectId,
      });
      const otherManagers = allMembers.filter(
        (m) =>
          m._id !== args.id &&
          MEMBER_MANAGEMENT_PERMISSIONS.every((p) => m.permissions.includes(p)),
      );
      if (otherManagers.length === 0) throw cantRemoveLastManager();
    }

    const updated = { ...membership, permissions: args.permissions };
    await ctx.db.replace(args.id, updated);

    await ctx.scheduler.runAfter(
      0,
      internal.email.actions.sendProjectMemberPermissionsChangedEmail,
      { to: targetUser.email, projectName: project.name },
    );

    ctx.audit.log({
      action: "updated",
      resource: "project_user",
      resourceId: args.id,
      projectId: project._id,
      message: `${ctx.user.email} updated permissions for "${targetUser.email}" in project "${project.name}"`,
      metadata: {
        email: targetUser.email,
        project: project.name,
        ...diffMetadata(membership, updated),
      },
    });
  },
});
