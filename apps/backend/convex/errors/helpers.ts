import { ConvexError } from 'convex/values'

export enum ErrorTypes {
  GENERIC_ERROR,
  MUTATION_ERROR,
  QUERY_ERROR,
}

export enum QueryErrorCode {
  PROJECT_NOT_FOUND,
  FLAG_NOT_FOUND,
  ENVIRONMENT_NOT_FOUND,
  API_KEY_NOT_FOUND,
  INVITE_NOT_FOUND,
  INVITE_EXPIRED,
  INVITE_ALREADY_USED,
  USER_NOT_FOUND,
}

export type GenericErrorData = {
  type: ErrorTypes.GENERIC_ERROR
  message: string
}

export type MutationErrorData = {
  type: ErrorTypes.MUTATION_ERROR
  fieldErrors: Record<string, string[]>
  formErrors: string[]
}

export type QueryErrorData = {
  type: ErrorTypes.QUERY_ERROR
  code: QueryErrorCode
  message: string
}

export type AppErrorData = GenericErrorData | MutationErrorData | QueryErrorData

export function isAppError(error: unknown): error is ConvexError<AppErrorData> {
  return (
    error instanceof ConvexError &&
    typeof error.data === 'object' &&
    error.data !== null &&
    'type' in error.data
  )
}

export function isQueryError(
  error: unknown,
): error is ConvexError<QueryErrorData> {
  return isAppError(error) && error.data.type === ErrorTypes.QUERY_ERROR
}

export const genericError = (message: string) =>
  new ConvexError<GenericErrorData>({ type: ErrorTypes.GENERIC_ERROR, message })

export const mutationError = (
  fieldErrors: Record<string, string[]>,
  formErrors: string[] = [],
) =>
  new ConvexError<MutationErrorData>({
    type: ErrorTypes.MUTATION_ERROR,
    fieldErrors,
    formErrors,
  })

export const queryError = (code: QueryErrorCode, message: string) =>
  new ConvexError<QueryErrorData>({
    type: ErrorTypes.QUERY_ERROR,
    code,
    message,
  })
