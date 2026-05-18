import { mutation } from '#convex/_generated/server.js'
import { getEnvironment } from '#convex/environments/helpers.js'
import { getProject, getProjectUser } from '#convex/projects/helpers.js'
import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'
import {
  environmentNotFound,
  flagAlreadyExistInEnvironment,
  flagNotFound,
  noPermission,
  notAProjectMember,
  notAuthenticated,
  projectNotFound,
} from '../errors'
import { getFlag, getFlagByKey } from './helpers'

export const createFlagMutation = mutation({
  args: {
    projectId: v.id('projects'),
    environmentId: v.id('environments'),
    key: v.string(),
    value: v.union(v.string(), v.number(), v.boolean(), v.null()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw notAuthenticated()

    const [project, environment, projectUser, existingFlag] = await Promise.all(
      [
        getProject(ctx, { id: args.projectId }),
        getEnvironment(ctx, { id: args.environmentId }),
        getProjectUser(ctx, {
          projectId: args.projectId,
          userId: userId,
        }),
        getFlagByKey(ctx, { environmentId: args.environmentId, key: args.key }),
      ],
    )

    if (!project) throw projectNotFound()
    if (!projectUser) throw notAProjectMember()
    if (!projectUser.permissions.includes('flag.create'))
      throw noPermission('create flags')
    if (!environment) throw environmentNotFound()
    if (existingFlag) throw flagAlreadyExistInEnvironment()

    await ctx.db.insert('flags', {
      projectId: project._id,
      environmentId: environment._id,
      key: args.key,
      value: args.value,
      description: args.description,
      enabled: false,
    })
  },
})

export const updateFlagMutation = mutation({
  args: {
    projectId: v.id('projects'),
    environmentId: v.id('environments'),
    flagId: v.id('flags'),
    key: v.optional(v.string()),
    value: v.optional(v.union(v.string(), v.number(), v.boolean(), v.null())),
    enabled: v.optional(v.boolean()),
    description: v.optional(v.string()),
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
    if (!projectUser.permissions.includes('flag.update'))
      throw noPermission('update flags')
    if (!environment) throw environmentNotFound()
    if (!flag) throw flagNotFound()

    const updatedFlag: typeof flag = {
      ...flag,
      key: args.key !== undefined ? args.key : flag.key,
      value: args.value !== undefined ? args.value : flag.value,
      enabled: args.enabled !== undefined ? args.enabled : flag.enabled,
      description:
        args.description !== undefined ? args.description : flag.description,
    }

    await ctx.db.replace('flags', flag._id, updatedFlag)
  },
})

export const deleteFlagMutation = mutation({
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
    if (!projectUser.permissions.includes('flag.delete'))
      throw noPermission('delete flags')
    if (!environment) throw environmentNotFound()
    if (!flag) throw flagNotFound()

    await ctx.db.delete('flags', flag._id)
  },
})
