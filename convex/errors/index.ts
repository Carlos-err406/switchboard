import {
  genericError,
  mutationError,
  queryError,
  QueryErrorCode,
} from './helpers'

export const notAuthenticated = () => genericError('Not authenticated')

export const noPermission = (action: string) =>
  genericError(`No permission to ${action}`)

export const projectNotFound = () =>
  queryError(QueryErrorCode.PROJECT_NOT_FOUND, 'Project not found')

export const projectAlreadyExist = () =>
  mutationError({
    name: ['A project with that name already exists'],
  })

export const flagNotFound = () =>
  queryError(QueryErrorCode.FLAG_NOT_FOUND, 'Flag not found')

export const environmentNotFound = () =>
  queryError(QueryErrorCode.ENVIRONMENT_NOT_FOUND, 'Environment not found')

export const cantDeleteTheLastEnvironment = () =>
  genericError('Can not delete the last environment')

export const notAProjectMember = () =>
  genericError('You are not a project member')

export const userNotAProjectMember = () =>
  genericError('User is not a project member')

export const environmentAlreadyExist = () =>
  mutationError({
    name: ['An environment with that name already exist in this project'],
  })

export const flagAlreadyExistInEnvironment = () =>
  mutationError({
    name: ['A flag with that name already exist in this environment'],
  })

export const apikeyAlreadyExist = () =>
  mutationError({
    name: ['An api key with that name already exist in this environment'],
  })

export const apiKeyNotFound = () =>
  queryError(QueryErrorCode.API_KEY_NOT_FOUND, 'Api key not found')

export const inviteNotFound = () =>
  queryError(QueryErrorCode.INVITE_NOT_FOUND, 'Invitation not found')

export const inviteExpired = () =>
  queryError(QueryErrorCode.INVITE_EXPIRED, 'Invitation expired')

export const inviteAlreadyUsed = () =>
  queryError(QueryErrorCode.INVITE_ALREADY_USED, 'Invitation already used')

export const userNotFound = () =>
  queryError(QueryErrorCode.USER_NOT_FOUND, 'User not found')
