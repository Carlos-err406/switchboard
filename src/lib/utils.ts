import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'
import { ConvexError } from 'convex/values'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toastMutationError = (error: Error) => {
  const message =
    error instanceof ConvexError ? (error.data as string) : error.message
  toast.error(message)
}
