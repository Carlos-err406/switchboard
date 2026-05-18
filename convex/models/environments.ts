import { mutation, query } from '#convex/_generated/server.js'
import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'
import {
  environmentAlreadyExist,
  noPermission,
  notAProjectMember,
  notAuthenticated,
  projectNotFound,
} from '../errors'
import {
  getEnvironmentByName,
  getEnvironmentFlags,
  getProject,
  getProjectEnvironments,
  getProjectUser,
} from './helpers'

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

export const createEnvironmentMutation = mutation({
  args: { projectId: v.id('projects'), name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw notAuthenticated()
    const projectUser = await getProjectUser(ctx, {
      projectId: args.projectId,
      userId: userId,
    })
    if (!projectUser) throw notAProjectMember()
    if (!projectUser.permissions.includes('environment.create'))
      throw noPermission('create environments')
    const project = await getProject(ctx, { id: args.projectId })
    if (!project) throw projectNotFound()
    const existing = await getEnvironmentByName(ctx, { name: args.name })
    if (existing) throw environmentAlreadyExist()
    await ctx.db.insert('environments', {
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
    const projectUser = await getProjectUser(ctx, {
      projectId: args.projectId,
      userId: userId,
    })
    if (!projectUser) throw notAProjectMember()
    if (!projectUser.permissions.includes('environment.delete'))
      throw noPermission('delete environments')
    const flags = await getEnvironmentFlags(ctx, { id: args.environmentId })
    await Promise.all([
      ctx.db.delete('environments', args.environmentId),
      ...flags.map((f) => ctx.db.delete('flags', f._id)),
    ])
  },
})
