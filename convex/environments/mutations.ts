import { mutation } from '#convex/_generated/server.js'
import { getEnvironmentFlags } from '#convex/flags/helpers.js'
import { getProject, getProjectUser } from '#convex/projects/helpers.js'
import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'
import {
  cantDeleteTheLastEnvironment,
  environmentAlreadyExist,
  environmentNotFound,
  noPermission,
  notAProjectMember,
  notAuthenticated,
  projectNotFound,
} from '../errors'
import {
  getEnvironment,
  getEnvironmentByName,
  getProjectEnvironments,
} from './helpers'

export const createEnvironmentMutation = mutation({
  args: {
    projectId: v.id('projects'),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw notAuthenticated()
    const [projectUser, project, existing] = await Promise.all([
      getProjectUser(ctx, {
        projectId: args.projectId,
        userId: userId,
      }),
      getProject(ctx, { id: args.projectId }),
      getEnvironmentByName(ctx, {
        projectId: args.projectId,
        name: args.name,
      }),
    ])
    if (!projectUser) throw notAProjectMember()
    if (!projectUser.permissions.includes('environment.create'))
      throw noPermission('create environments')
    if (!project) throw projectNotFound()
    if (existing) throw environmentAlreadyExist()

    return await ctx.db.insert('environments', {
      projectId: args.projectId,
      name: args.name,
      description: args.description,
    })
  },
})

export const deleteEnvironmentMutation = mutation({
  args: { environmentId: v.id('environments') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw notAuthenticated()
    const environment = await getEnvironment(ctx, { id: args.environmentId })
    if (!environment) throw environmentNotFound()

    const [projectUser, projectEnvironments, project, flags] =
      await Promise.all([
        getProjectUser(ctx, {
          projectId: environment.projectId,
          userId: userId,
        }),
        getProjectEnvironments(ctx, { id: environment.projectId }),
        getProject(ctx, { id: environment.projectId }),
        getEnvironmentFlags(ctx, { id: environment._id }),
      ])

    if (!project) throw projectNotFound()
    if (!projectUser) throw notAProjectMember()
    if (!projectUser.permissions.includes('environment.delete'))
      throw noPermission('delete environments')
    if (projectEnvironments.length === 1) throw cantDeleteTheLastEnvironment()

    await Promise.all([
      ctx.db.delete('environments', args.environmentId),
      ...flags.map((f) => ctx.db.delete('flags', f._id)),
    ])
  },
})

export const updateEnvironmentMutation = mutation({
  args: {
    environmentId: v.id('environments'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw notAuthenticated()
    const environment = await getEnvironment(ctx, { id: args.environmentId })
    if (!environment) throw environmentNotFound()

    const [projectUser, project, existingName] = await Promise.all([
      getProjectUser(ctx, {
        projectId: environment.projectId,
        userId: userId,
      }),
      getProject(ctx, { id: environment.projectId }),
      args.name !== undefined
        ? getEnvironmentByName(ctx, {
            projectId: environment.projectId,
            name: args.name,
          }).then(Boolean)
        : Promise.resolve(false),
    ])

    if (existingName) throw environmentAlreadyExist()
    if (!project) throw projectNotFound()
    if (!projectUser) throw notAProjectMember()
    if (!projectUser.permissions.includes('environment.update'))
      throw noPermission('update environments')
    const updatedEnv: typeof environment = {
      ...environment,
      name: args.name !== undefined ? args.name : environment.name,
      description:
        args.description !== undefined
          ? args.description
          : environment.description,
    }
    await ctx.db.replace('environments', environment._id, updatedEnv)
  },
})
