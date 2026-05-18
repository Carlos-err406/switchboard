import type { DataModel, Id } from '#convex/_generated/dataModel.js'
import type { GenericQueryCtx } from 'convex/server'

export const getProject = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { id: Id<'projects'> },
) => {
  return await ctx.db
    .query('projects')
    .withIndex('by_id', (q) => q.eq('_id', args.id))
    .unique()
}
export const getProjectByName = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { name: string },
) => {
  return await ctx.db
    .query('projects')
    .withIndex('by_name', (q) => q.eq('name', args.name))
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

export const getUserProjects = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { id: Id<'users'>; q?: string },
) => {
  return await ctx.db
    .query('projectUsers')
    .withIndex('by_user_id', (q) => q.eq('userId', args.id))
    .order('desc')
    .collect()
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
