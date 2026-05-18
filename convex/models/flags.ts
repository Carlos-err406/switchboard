import { mutation, query } from '#convex/_generated/server.js'
import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'
import {
  environmentNotFound,
  flagNotFound,
  noPermission,
  notAProjectMember,
  notAuthenticated,
  projectNotFound,
} from '../errors'
import {
  getEnvironment,
  getFlag,
  getProject,
  getProjectFlags,
  getProjectUser,
} from './helpers'

export const getFlagsQuery = query({
  args: { projectId: v.id('projects'), q: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw notAuthenticated()
    const projectUser = await getProjectUser(ctx, {
      projectId: args.projectId,
      userId: userId,
    })
    if (!projectUser) throw notAProjectMember()
    const flags = await getProjectFlags(ctx, { id: args.projectId })
    return flags.filter((flag) => flag.key.includes(args.q ?? ''))
  },
})

export const createFlagMutation = mutation({
  args: {
    projectId: v.id('projects'),
    environmentId: v.id('environments'),
    key: v.string(),
    value: v.union(v.string(), v.number(), v.boolean(), v.null()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw notAuthenticated()
    const projectUser = await getProjectUser(ctx, {
      projectId: args.projectId,
      userId: userId,
    })

    if (!projectUser) throw notAProjectMember()
    if (!projectUser.permissions.includes('flag.create'))
      throw noPermission('create flags')
    const project = await getProject(ctx, { id: args.projectId })
    if (!project) throw projectNotFound()
    const environment = await getEnvironment(ctx, { id: args.environmentId })
    if (!environment) throw environmentNotFound()

    await ctx.db.insert('flags', {
      projectId: args.projectId,
      environmentId: args.environmentId,
      key: args.key,
      value: args.value,
      enabled: false,
    })
  },
})

export const toggleFlagMutation = mutation({
  args: {
    projectId: v.id('projects'),
    environmentId: v.id('environments'),
    flagId: v.id('flags'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw notAuthenticated()
    const projectUser = await getProjectUser(ctx, {
      projectId: args.projectId,
      userId: userId,
    })
    if (!projectUser) throw notAProjectMember()
    if (!projectUser.permissions.includes('flag.update'))
      throw noPermission('update flags')
    const project = await getProject(ctx, { id: args.projectId })

    if (!project) throw projectNotFound()
    const environment = await getEnvironment(ctx, { id: args.environmentId })
    if (!environment) throw environmentNotFound()
    const flag = await getFlag(ctx, { id: args.flagId })
    if (!flag) throw flagNotFound()
    await ctx.db.patch('flags', flag._id, { enabled: !flag.enabled })
  },
})

export const updateFlagMutation = mutation({
  args: {
    projectId: v.id('projects'),
    environmentId: v.id('environments'),
    flagId: v.id('flags'),
    key: v.optional(v.string()),
    value: v.optional(v.union(v.string(), v.number(), v.boolean(), v.null())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw notAuthenticated()
    const projectUser = await getProjectUser(ctx, {
      projectId: args.projectId,
      userId: userId,
    })
    if (!projectUser) throw notAProjectMember()
    if (!projectUser.permissions.includes('flag.update'))
      throw noPermission('update flags')
    const project = await getProject(ctx, { id: args.projectId })

    if (!project) throw projectNotFound()
    const environment = await getEnvironment(ctx, { id: args.environmentId })
    if (!environment) throw environmentNotFound()
    const flag = await getFlag(ctx, { id: args.flagId })
    if (!flag) throw flagNotFound()
    await ctx.db.patch('flags', flag._id, {
      key: args.key,
      value: args.value,
    })
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
    const projectUser = await getProjectUser(ctx, {
      projectId: args.projectId,
      userId: userId,
    })
    if (!projectUser) throw notAProjectMember()
    if (!projectUser.permissions.includes('flag.delete'))
      throw noPermission('delete flags')
    const project = await getProject(ctx, { id: args.projectId })

    if (!project) throw projectNotFound()
    const environment = await getEnvironment(ctx, { id: args.environmentId })
    if (!environment) throw environmentNotFound()
    const flag = await getFlag(ctx, { id: args.flagId })
    if (!flag) throw flagNotFound()
    await ctx.db.delete('flags', flag._id)
  },
})
