import { query } from '#convex/_generated/server.js'
import { getEnvironment } from '#convex/environments/helpers.js'
import { getProject, getProjectUser } from '#convex/projects/helpers.js'
import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'
import {
  environmentNotFound,
  flagNotFound,
  notAProjectMember,
  notAuthenticated,
  projectNotFound,
} from '../errors'
import { getFlag, getFlags } from './helpers'

export const getFlagsQuery = query({
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

    const flags = await getFlags(ctx, {
      projectId: project._id,
      environmentId: environment._id,
    })
    return flags.filter((flag) => flag.key.includes(args.q ?? ''))
  },
})

export const getFlagQuery = query({
  args: {
    projectId: v.id('projects'),
    environmentId: v.id('environments'),
    flagId: v.id('flags'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw notAuthenticated()

    const [project, environment, projectUser, flag] = await Promise.all([
      getProject(ctx, { id: args.projectId }),
      getEnvironment(ctx, { id: args.environmentId }),
      getProjectUser(ctx, {
        projectId: args.projectId,
        userId: userId,
      }),
      getFlag(ctx, { id: args.flagId }),
    ])

    if (!project) throw projectNotFound()
    if (!projectUser) throw notAProjectMember()
    if (!environment) throw environmentNotFound()
    if (!flag) throw flagNotFound()

    return flag
  },
})
