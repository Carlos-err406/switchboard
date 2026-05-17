import { ConvexError } from 'convex/values'

export const notAuthenticated = () => new ConvexError('Not authenticated')

export const noPermission = (action: string) =>
  new ConvexError(`No permission to ${action}`)

export const projectNotFound = () => new ConvexError('Project not found')
export const notAProjectMember = () =>
  new ConvexError('You are not a project member')
