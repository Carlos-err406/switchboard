import { api } from '@convex/_generated/api.js'
import type { Id } from '@convex/_generated/dataModel.js'
import type {
  ProjectUserPermissionValue,
  UserPermissionValue,
} from '@convex/schema/helpers'
import { useQuery } from 'convex/react'

export const useHasPermissions = (permissions: UserPermissionValue[]) => {
  const user = useQuery(api.users.queries.currentUserQuery)
  for (const permission of permissions) {
    if (!user?.permissions.includes(permission)) return false
  }
  return true
}

export const useHasProjectPermissions = (
  permissions: ProjectUserPermissionValue[],
  projectId: Id<'projects'>,
) => {
  const projectUser = useQuery(api.projects.queries.getProjectUserQuery, {
    projectId,
  })
  for (const permission of permissions) {
    if (!projectUser?.permissions.includes(permission)) return false
  }
  return true
}
