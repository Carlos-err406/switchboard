import { query } from '#convex/_generated/server.js'
import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'
import {
  environmentNotFound,
  notAProjectMember,
  notAuthenticated,
  projectNotFound,
} from '../errors'
import { getEnvironment } from '#convex/environments/helpers.js'
import { getProject, getProjectUser } from '#convex/projects/helpers.js'

export const getApiKeysQuery = query({
  args: {
    projectId: v.id('projects'),
    environmentId: v.id('environments'),
    q: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw notAuthenticated()

    const [project, environment, projectUser] = await Promise.all([
      getProject(ctx, { id: args.projectId }),
      getEnvironment(ctx, { id: args.environmentId }),
      getProjectUser(ctx, {
        projectId: args.projectId,
        userId: userId,
      }),
    ])

    if (!project) throw projectNotFound()
    if (!projectUser) throw notAProjectMember()
    if (!environment) throw environmentNotFound()
  },
})
