import type { DataModel, Id } from '#convex/_generated/dataModel.js'
import type { GenericQueryCtx } from 'convex/server'

export const getProjectEnvironments = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { id: Id<'projects'> },
) => {
  return await ctx.db
    .query('environments')
    .withIndex('by_project_id', (q) => q.eq('projectId', args.id))
    .collect()
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

export const getEnvironmentByName = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { projectId: Id<'projects'>; name: string },
) => {
  return await ctx.db
    .query('environments')
    .withIndex('by_name_in_project', (q) =>
      q.eq('projectId', args.projectId).eq('name', args.name),
    )
    .unique()
}
