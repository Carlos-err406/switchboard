import type { DataModel, Id } from '#convex/_generated/dataModel.js'
import { getAuthUserId } from '@convex-dev/auth/server'
import type { GenericQueryCtx } from 'convex/server'

type DefinedPatch<T extends Record<string, unknown>> = {
  [K in keyof T]?: Exclude<T[K], undefined>
}

export const createPatch = <T extends Record<string, unknown>>(
  values: T,
): DefinedPatch<T> => {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== undefined),
  ) as DefinedPatch<T>
}
