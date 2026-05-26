export const AUDIT_ACTIONS = [
  'created',
  'updated',
  'deleted',
  'toggled',
  'rotated',
  'invited',
  'locked',
  'unlocked',
] as const

export const AUDIT_RESOURCES = [
  'flag',
  'project',
  'environment',
  'api_key',
  'user',
  'invite',
  'project_user',
] as const

export type AuditAction = (typeof AUDIT_ACTIONS)[number]
export type AuditResource = (typeof AUDIT_RESOURCES)[number]

const SKIP_KEYS = new Set(['_id', '_creationTime'])

export function diffMetadata(
  before: Record<string, unknown>,
  after: Record<string, unknown>,
): Record<string, string> {
  const metadata: Record<string, string> = {}
  for (const key of Object.keys(after)) {
    if (SKIP_KEYS.has(key)) continue
    if (after[key] !== before[key]) {
      metadata[`${key}.old`] = String(before[key] ?? '')
      metadata[`${key}.new`] = String(after[key] ?? '')
    }
  }
  return metadata
}
