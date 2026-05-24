import { mutation } from '../_generated/server.js'
import { getEnvironment } from '../environments/helpers.js'
import { getProjectUser } from '../project_users/helpers.js'
import { getProject } from '../projects/helpers.js'
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
    environmentId: v.id('environments'),
    key: v.string(),
    value: v.union(v.string(), v.number(), v.boolean(), v.null()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw notAuthenticated()

    const environment = await getEnvironment(ctx, { id: args.environmentId })
    if (!environment) throw environmentNotFound()
    const [project, projectUser, existingFlag] = await Promise.all([
      getProject(ctx, { id: environment.projectId }),
      getProjectUser(ctx, {
        projectId: environment.projectId,
        userId: userId,
      }),
      getFlagByKey(ctx, { environmentId: args.environmentId, key: args.key }),
    ])

    if (!project) throw projectNotFound()
    if (!projectUser) throw notAProjectMember()
    if (!projectUser.permissions.includes('flag.create'))
      throw noPermission('create flags')
    if (existingFlag) throw flagAlreadyExistInEnvironment()

    await ctx.db.insert('flags', {
      projectId: project._id,
      environmentId: environment._id,
      key: args.key,
      value: args.value,
      description: args.description,
      enabled: true,
    })
  },
})

export const updateFlagMutation = mutation({
  args: {
    flagId: v.id('flags'),
    key: v.optional(v.string()),
    value: v.optional(v.union(v.string(), v.number(), v.boolean(), v.null())),
    enabled: v.optional(v.boolean()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw notAuthenticated()

    const flag = await getFlag(ctx, { id: args.flagId })
    if (!flag) throw flagNotFound()

    const [project, projectUser, environment, existingName] = await Promise.all(
      [
        getProject(ctx, { id: flag.projectId }),
        getProjectUser(ctx, {
          projectId: flag.projectId,
          userId: userId,
        }),
        getEnvironment(ctx, { id: flag.environmentId }),
        args.key !== undefined
          ? getFlagByKey(ctx, {
              environmentId: flag.environmentId,
              key: args.key,
            }).then(Boolean)
          : Promise.resolve(false),
      ],
    )
    if (existingName) throw flagAlreadyExistInEnvironment()
    if (!project) throw projectNotFound()
    if (!projectUser) throw notAProjectMember()
    if (!environment) throw environmentNotFound()
    if (!projectUser.permissions.includes('flag.update'))
      throw noPermission('update flags')

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
  args: { flagId: v.id('flags') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw notAuthenticated()

    const flag = await getFlag(ctx, { id: args.flagId })
    if (!flag) throw flagNotFound()
    const [project, environment, projectUser] = await Promise.all([
      getProject(ctx, { id: flag.projectId }),
      getEnvironment(ctx, { id: flag.environmentId }),
      getProjectUser(ctx, {
        projectId: flag.projectId,
        userId: userId,
      }),
    ])

    if (!project) throw projectNotFound()
    if (!projectUser) throw notAProjectMember()
    if (!projectUser.permissions.includes('flag.delete'))
      throw noPermission('delete flags')
    if (!environment) throw environmentNotFound()

    await ctx.db.delete('flags', flag._id)
  },
})
