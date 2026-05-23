import { Button } from '#/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { onFormError } from '#/lib/utils.ts'
import { api } from '#convex/_generated/api.js'
import type { Id } from '#convex/_generated/dataModel.js'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useAction } from 'convex/react'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'

const changePasswordSchema = z
  .object({
    oldPassword: z.string().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    error: 'Passwords do not match',
  })
type ChangePasswordInputs = z.infer<typeof changePasswordSchema>

type Props = {
  userId: Id<'users'>
  requireOldPassword?: boolean
  onSuccess?: () => void
}

export const ChangePasswordForm: FC<Props> = ({
  userId,
  requireOldPassword,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordInputs>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: '', password: '', confirmPassword: '' },
  })

  const changePassword = useAction(api.users.actions.changeUserPasswordAction)
  const { mutate, isPending } = useMutation({
    mutationFn: (data: ChangePasswordInputs) =>
      changePassword({
        userId,
        newPassword: data.password,
        oldPassword: requireOldPassword ? data.oldPassword : undefined,
      }),
    onError: onFormError(setError),
    onSuccess: () => {
      reset()
      onSuccess?.()
    },
  })

  return (
    <form noValidate onSubmit={handleSubmit((data) => mutate(data))}>
      <FieldSet>
        <FieldGroup>
          {requireOldPassword && (
            <Field required>
              <FieldLabel htmlFor="old-password">Current password</FieldLabel>
              <Input
                id="old-password"
                type="password"
                placeholder="Current password"
                {...register('oldPassword')}
              />
              <FieldError>{errors.oldPassword?.message}</FieldError>
            </Field>
          )}
          <Field required>
            <FieldLabel htmlFor="new-password">New password</FieldLabel>
            <Input
              id="new-password"
              type="password"
              placeholder="New password"
              {...register('password')}
            />
            <FieldError>{errors.password?.message}</FieldError>
          </Field>
          <Field required>
            <FieldLabel htmlFor="confirm-password">Confirm password</FieldLabel>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm password"
              {...register('confirmPassword')}
            />
            <FieldError>{errors.confirmPassword?.message}</FieldError>
          </Field>
        </FieldGroup>

        {errors.root?.message && <FieldError>{errors.root.message}</FieldError>}

        <Button type="submit" disabled={isPending} className="ml-auto">
          {isPending ? 'Saving...' : 'Change password'}
        </Button>
      </FieldSet>
    </form>
  )
}
