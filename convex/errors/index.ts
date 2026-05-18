import { ConvexError } from 'convex/values'

export const notAuthenticated = () => new ConvexError('Not authenticated')

export const noPermission = (action: string) =>
  new ConvexError(`No permission to ${action}`)

export const projectNotFound = () => new ConvexError('Project not found')

export const projectAlreadyExist = () =>
  new ConvexError('Project already exist')

export const flagNotFound = () => new ConvexError('Flag not found')

export const environmentNotFound = () =>
  new ConvexError('Environment not found')

export const notAProjectMember = () =>
  new ConvexError('You are not a project member')

export const environmentAlreadyExist = () =>
  new ConvexError('Environment already exist')

export const flagAlreadyExistInEnvironment = () =>
  new ConvexError('Flag already exist in this environment')
