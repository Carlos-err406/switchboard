import { getOneFrom } from 'convex-helpers/server/relationships';
import { GenericQueryCtx } from 'convex/server';
import { DataModel } from './_generated/dataModel';

export const getUserByEmail = async (
  ctx: GenericQueryCtx<DataModel>,
  email: string,
) => {
  return await getOneFrom(ctx.db, 'users', 'email', email)
}

export const getUserByAuthId = async (
  ctx: GenericQueryCtx<DataModel>,
  id: string,
) => {
  return await getOneFrom(ctx.db, 'users', 'auth_id', id)
}

export const getConvexUser = async (ctx: GenericQueryCtx<DataModel>) => {
  const userId = await ctx.auth.getUserIdentity()
  if (!userId?.subject) return null
  return getUserByAuthId(ctx, userId.subject)
}
