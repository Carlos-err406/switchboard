import { Button } from '@switchboard/ui/components/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from '@switchboard/ui/components/field'
import { Switch } from '@switchboard/ui/components/switch'
import { onFormError } from '#/lib/utils.ts'
import { api } from '@convex/_generated/api.js'
import type { Doc } from '@convex/_generated/dataModel.js'
import { USER_PERMISSIONS } from '@convex/schema/helpers.js'
import { useConvexMutation } from '@convex-dev/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useQuery } from 'convex/react'
import type { FC } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { PERMISSION_LABELS } from './utils'

const updatePermissionsSchema = z.object({
  permissions: z.array(z.enum(USER_PERMISSIONS)),
})
type UpdatePermissionsInputs = z.infer<typeof updatePermissionsSchema>

type Props = {
  user: Doc<'users'>
  onSuccess?: () => void
}

export const UpdatePermissionsForm: FC<Props> = ({ user, onSuccess }) => {
  const currentUser = useQuery(api.users.queries.currentUserQuery)
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<UpdatePermissionsInputs>({
    defaultValues: { permissions: [...user.permissions] },
    resolver: zodResolver(updatePermissionsSchema),
  })

  const mutationFn = useConvexMutation(api.users.mutations.updateUserMutation)
  const { mutate: updateUser, isPending } = useMutation({
    mutationFn,
    onError: onFormError(setError),
    onSuccess,
  })

  return (
    <form
      noValidate
      onSubmit={handleSubmit((data) =>
        updateUser({ userId: user._id, permissions: data.permissions }),
      )}
    >
      <FieldSet>
        <Field>
          <FieldTitle>Permissions</FieldTitle>
          <FieldDescription>
            You can only grant permissions you hold yourself.
          </FieldDescription>

          <Controller
            control={control}
            name="permissions"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2">
                {USER_PERMISSIONS.map((permission) => {
                  const enabled = currentUser?.permissions.includes(permission)
                  const checked = field.value.includes(permission)
                  return (
                    <div key={permission} className="flex items-center gap-2">
                      <Switch
                        size="sm"
                        id={`perm-${user._id}-${permission}`}
                        disabled={!enabled}
                        checked={checked}
                        onCheckedChange={(on) => {
                          field.onChange(
                            on
                              ? [...field.value, permission]
                              : field.value.filter((p) => p !== permission),
                          )
                        }}
                      />
                      <FieldLabel
                        htmlFor={`perm-${user._id}-${permission}`}
                        data-disabled={!enabled}
                        className="flex items-center justify-between gap-2 data-disabled:text-muted-foreground"
                      >
                        {PERMISSION_LABELS[permission]}
                      </FieldLabel>
                    </div>
                  )
                })}
              </div>
            )}
          />

          <FieldError>{errors.permissions?.message}</FieldError>
        </Field>

        <Button type="submit" disabled={isPending} className="ml-auto">
          {isPending ? 'Saving...' : 'Save permissions'}
        </Button>
      </FieldSet>
    </form>
  )
}
