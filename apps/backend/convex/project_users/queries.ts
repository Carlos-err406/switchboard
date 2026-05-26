import { v } from "convex/values";
import { authenticatedQuery } from "../lib/functions.js";
import { getProject } from "../projects/helpers.js";
import { getUserById } from "../users/helpers.js";
import { notAProjectMember, projectNotFound } from "../errors";
import { getProjectUser, getProjectUsers } from "./helpers";

export const getProjectMembersQuery = authenticatedQuery({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const [project, projectUser] = await Promise.all([
      getProject(ctx, { id: args.projectId }),
      getProjectUser(ctx, {
        projectId: args.projectId,
        userId: ctx.user._id,
      }),
    ]);
    if (!project) throw projectNotFound();
    if (!projectUser && ctx.user.role !== "admin") throw notAProjectMember();

    const members = await getProjectUsers(ctx, { id: args.projectId });

    const enriched = await Promise.all(
      members.map(async (member) => {
        const user = await getUserById(ctx, { id: member.userId });
        return user
          ? {
              ...member,
              email: user.email,
              role: user.role,
              isOwner: project!.createdBy === member.userId,
            }
          : null;
      }),
    );

    return enriched.filter((m): m is NonNullable<typeof m> => m !== null);
  },
});

export const getProjectUserQuery = authenticatedQuery({
  args: { projectId: v.id("projects"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const projectUser = await getProjectUser(ctx, {
      projectId: args.projectId,
      userId: args.userId,
    });
    return projectUser;
  },
});
