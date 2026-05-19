import { ConvexError } from 'convex/values'

export const notAuthenticated = () => new ConvexError('Not authenticated')

export const noPermission = (action: string) =>
  new ConvexError(`No permission to ${action}`)

export const projectNotFound = () => new ConvexError('Project not found')

export const projectAlreadyExist = () =>
  new ConvexError('A project with that name already exist')

export const flagNotFound = () => new ConvexError('Flag not found')

export const environmentNotFound = () =>
  new ConvexError('Environment not found')

export const cantDeleteTheLastEnvironment = () =>
  new ConvexError('Can not delete the last environment')

export const notAProjectMember = () =>
  new ConvexError('You are not a project member')

export const environmentAlreadyExist = () =>
  new ConvexError('An environment with that name already exist in this project')

export const flagAlreadyExistInEnvironment = () =>
  new ConvexError('A flag with that name already exist in this environment')

export const apikeyAlreadyExist = () =>
  new ConvexError('An api key with that name already exist in this environment')

export const apiKeyNotFound = () => new ConvexError('Api Key not found')
