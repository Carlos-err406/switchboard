import type { DataModel, Id } from '#convex/_generated/dataModel.js'
import type { GenericQueryCtx } from 'convex/server'

export const API_KEY_PREFIX = 'sk_live'

const base64url = (bytes: Uint8Array) => {
  return btoa(String.fromCharCode(...bytes))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}

const bytesToHex = (bytes: Uint8Array) => {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export const hashApiKey = async (apiKey: string) => {
  const data = new TextEncoder().encode(apiKey)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return bytesToHex(new Uint8Array(hashBuffer))
}

export const generateApiKey = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return `${API_KEY_PREFIX}_${base64url(bytes)}`
}

export const validateApiKey = async (apiKey: string, hash: string) => {
  const hash2 = await hashApiKey(apiKey)
  return hash2 === hash
}

export const getProjectApiKeys = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { projectId: Id<'projects'> },
) => {
  return await ctx.db
    .query('apiKeys')
    .withIndex('by_project_id', (q) => q.eq('projectId', args.projectId))
    .collect()
}

export const getApiKeyByName = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { environmentId: Id<'environments'>; name: string },
) => {
  return await ctx.db
    .query('apiKeys')
    .withIndex('by_name_in_environment', (q) =>
      q.eq('environmentId', args.environmentId).eq('name', args.name),
    )
    .unique()
}

export const getApiKey = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { id: Id<'apiKeys'> },
) => {
  return await ctx.db
    .query('apiKeys')
    .withIndex('by_id', (q) => q.eq('_id', args.id))
    .unique()
}

export const getEnvironmentApiKeys = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { id: Id<'environments'> },
) => {
  return await ctx.db
    .query('apiKeys')
    .withIndex('by_environment_id', (q) => q.eq('environmentId', args.id))
    .collect()
}

export const getApiKeyByHash = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { hash: string },
) => {
  return ctx.db
    .query('apiKeys')
    .withIndex('by_key_hash', (q) => q.eq('keyHash', args.hash))
    .unique()
}

export const getApiKeyByValue = async (
  ctx: GenericQueryCtx<DataModel>,
  args: { value: string },
) => {
  const hash = await hashApiKey(args.value)
  return ctx.db
    .query('apiKeys')
    .withIndex('by_key_hash', (q) => q.eq('keyHash', hash))
    .unique()
}
