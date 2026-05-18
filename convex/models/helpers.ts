import type { DataModel, Id } from '#convex/_generated/dataModel.js'
import { getAuthUserId } from '@convex-dev/auth/server'
import type { GenericQueryCtx } from 'convex/server'

export const getAuthUser = async (ctx: GenericQueryCtx<DataModel>) => {
  const identity = await getAuthUserId(ctx)
  if (!identity) return null
  return await ctx.db
    .query('users')
    .withIndex('by_id', (q) => q.eq('_id', identity))
    .unique()
}

export const getProject = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { id: Id<'projects'> },
) => {
  return await ctx.db
    .query('projects')
    .withIndex('by_id', (q) => q.eq('_id', args.id))
    .unique()
}

export const getProjectUser = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { projectId: Id<'projects'>; userId: Id<'users'> },
) => {
  return await ctx.db
    .query('projectUsers')
    .withIndex('by_project_user', (q) =>
      q.eq('projectId', args.projectId).eq('userId', args.userId),
    )
    .unique()
}

export const getProjectUsers = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { id: Id<'projects'> },
) => {
  return await ctx.db
    .query('projectUsers')
    .withIndex('by_project_id', (q) => q.eq('projectId', args.id))
    .collect()
}

export const getUserProjects = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { id: Id<'users'>; q?: string },
) => {
  return await ctx.db
    .query('projectUsers')
    .withIndex('by_user_id', (q) => q.eq('userId', args.id))
    .collect()
}

export const getProjectFlags = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { id: Id<'projects'> },
) => {
  return await ctx.db
    .query('flags')
    .withIndex('by_project_id', (q) => q.eq('projectId', args.id))
    .collect()
}

export const getProjectEnvironments = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { id: Id<'projects'> },
) => {
  return await ctx.db
    .query('environments')
    .withIndex('by_project_id', (q) => q.eq('projectId', args.id))
    .collect()
}

export const getProjectApiKeys = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { id: Id<'projects'> },
) => {
  return await ctx.db
    .query('apiKeys')
    .withIndex('by_project_id', (q) => q.eq('projectId', args.id))
    .collect()
}

export const getFlag = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { id: Id<'flags'> },
) => {
  return await ctx.db
    .query('flags')
    .withIndex('by_id', (q) => q.eq('_id', args.id))
    .unique()
}

export const getEnvironment = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { id: Id<'environments'> },
) => {
  return await ctx.db
    .query('environments')
    .withIndex('by_id', (q) => q.eq('_id', args.id))
    .unique()
}

export const getEnvironmentFlags = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { id: Id<'environments'> },
) => {
  return await ctx.db
    .query('flags')
    .withIndex('by_environment_id', (q) => q.eq('environmentId', args.id))
    .collect()
}

export const getEnvironmentByName = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { name: string },
) => {
  return await ctx.db
    .query('environments')
    .withIndex('by_name', (q) => q.eq('name', args.name))
    .unique()
}
