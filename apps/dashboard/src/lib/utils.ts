import { ErrorTypes, isAppError } from '@convex/errors/helpers'
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { toast } from 'sonner'

export { cn } from '@switchboard/ui/utils'

export function setMutationFormErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  error: unknown,
) {
  if (!isAppError(error)) return false
  if (error.data.type !== ErrorTypes.MUTATION_ERROR) return false

  for (const [field, messages] of Object.entries(error.data.fieldErrors)) {
    setError(field as Path<T>, {
      type: 'server',
      message: messages[0],
    })
  }

  if (error.data.formErrors[0]) {
    setError('root', {
      type: 'server',
      message: error.data.formErrors[0],
    })
  }

  return true
}

export const toastMutationError = (error: unknown) => {
  const message =
    isAppError(error) && error.data.type === ErrorTypes.GENERIC_ERROR
      ? error.data.message
      : error instanceof Error
        ? error.message
        : 'Something went wrong'

  toast.error(message)
}

export const onFormError =
  <T extends FieldValues>(setError: UseFormSetError<T>) =>
  (error: unknown) => {
    if (setMutationFormErrors(setError, error)) return
    toastMutationError(error)
  }
