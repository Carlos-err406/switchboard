import { query } from '#convex/_generated/server.js'
import { getProject, getProjectUser } from '#convex/projects/helpers.js'
import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'
import { notAProjectMember, notAuthenticated, projectNotFound } from '../errors'
import { getProjectEnvironments } from './helpers'

export const getEnvironmentsQuery = query({
  args: { projectId: v.id('projects'), q: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw notAuthenticated()
    const projectUser = await getProjectUser(ctx, {
      projectId: args.projectId,
      userId: userId,
    })
    if (!projectUser) throw notAProjectMember()
    const project = await getProject(ctx, { id: args.projectId })
    if (!project) throw projectNotFound()
    const environments = await getProjectEnvironments(ctx, {
      id: args.projectId,
    })
    return environments.filter((environment) =>
      environment.name.includes(args.q ?? ''),
    )
  },
})
