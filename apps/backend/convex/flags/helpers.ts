import type { DataModel, Id } from '../_generated/dataModel.js'
import type { GenericQueryCtx } from 'convex/server'

export const getFlags = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { environmentId: Id<'environments'> },
) => {
  return await ctx.db
    .query('flags')
    .withIndex('by_environment_id', (q) =>
      q.eq('environmentId', args.environmentId),
    )
    .order('desc')
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

export const getFlag = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { id: Id<'flags'> },
) => {
  return await ctx.db
    .query('flags')
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

export const getFlagByKey = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { environmentId: Id<'environments'>; key: string },
) => {
  return await ctx.db
    .query('flags')
    .withIndex('by_environment_flag_key', (q) =>
      q.eq('environmentId', args.environmentId).eq('key', args.key),
    )
    .unique()
}
