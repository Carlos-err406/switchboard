import { query } from "../_generated/server.js";
import { getProject } from "../projects/helpers.js";
import { getAuthUser, getUserById } from "../users/helpers.js";
import { v } from "convex/values";
import {
  notAuthenticated,
  projectNotFound,
  userNotAProjectMember,
  userNotFound,
} from "../errors";
import { getProjectUser } from "./helpers";

export const getProjectUserQuery = query({
  args: { projectId: v.id("projects"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const authUser = await getAuthUser(ctx);
    if (!authUser) throw notAuthenticated();
    const [project, user, projectUser] = await Promise.all([
      getProject(ctx, { id: args.projectId }),
      getUserById(ctx, { id: args.userId }),
      getProjectUser(ctx, { projectId: args.projectId, userId: args.userId }),
    ]);
    if (!project) throw projectNotFound();
    if (!user) throw userNotFound();
    if (!projectUser) throw userNotAProjectMember();
    return projectUser;
  },
});
