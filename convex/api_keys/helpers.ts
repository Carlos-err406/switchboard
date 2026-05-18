import type { DataModel, Id } from '#convex/_generated/dataModel.js'
import type { GenericQueryCtx } from 'convex/server'

function base64url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function hashApiKey(apiKey: string) {
  const data = new TextEncoder().encode(apiKey)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return bytesToHex(new Uint8Array(hashBuffer))
}

export function generateApiKey(prefix = 'sk_live') {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return `${prefix}_${base64url(bytes)}`
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
