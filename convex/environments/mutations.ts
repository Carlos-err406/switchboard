import { mutation } from '#convex/_generated/server.js'
import { getEnvironmentFlags } from '#convex/flags/helpers.js'
import { getProject, getProjectUser } from '#convex/projects/helpers.js'
import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'
import {
  environmentAlreadyExist,
  environmentNotFound,
  noPermission,
  notAProjectMember,
  notAuthenticated,
  projectNotFound,
} from '../errors'
import { getEnvironment, getEnvironmentByName } from './helpers'

export const createEnvironmentMutation = mutation({
  args: { projectId: v.id('projects'), name: v.string() },
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
    })
  },
})

export const deleteEnvironmentMutation = mutation({
  args: { projectId: v.id('projects'), environmentId: v.id('environments') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw notAuthenticated()

    const [projectUser, project, flags] = await Promise.all([
      getProjectUser(ctx, {
        projectId: args.projectId,
        userId: userId,
      }),
      getProject(ctx, { id: args.projectId }),
      getEnvironmentFlags(ctx, { id: args.environmentId }),
    ])

    if (!project) throw projectNotFound()
    if (!projectUser) throw notAProjectMember()
    if (!projectUser.permissions.includes('environment.delete'))
      throw noPermission('delete environments')

    await Promise.all([
      ctx.db.delete('environments', args.environmentId),
      ...flags.map((f) => ctx.db.delete('flags', f._id)),
    ])
  },
})

export const renameEnvironmentMutation = mutation({
  args: {
    environmentId: v.id('environments'),
    projectId: v.id('projects'),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw notAuthenticated()
    const [projectUser, project, environment] = await Promise.all([
      getProjectUser(ctx, {
        projectId: args.projectId,
        userId: userId,
      }),
      getProject(ctx, { id: args.projectId }),
      getEnvironment(ctx, { id: args.environmentId }),
    ])

    if (!project) throw projectNotFound()
    if (!projectUser) throw notAProjectMember()
    if (!projectUser.permissions.includes('environment.update'))
      throw noPermission('update environments')
    if (!environment) throw environmentNotFound()

    await ctx.db.patch('environments', environment._id, { name: args.name })
  },
})
