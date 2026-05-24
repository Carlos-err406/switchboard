import { Button } from '@switchboard/ui/components/button'
import {
  Field,
  FieldError,
  FieldLabel,
  FieldSet,
} from '@switchboard/ui/components/field'
import { Input } from '@switchboard/ui/components/input'
import { onFormError } from '#/lib/utils.ts'
import { api } from '@convex/_generated/api.js'
import type { Doc } from '@convex/_generated/dataModel.js'
import { useConvexMutation } from '@convex-dev/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import type { FC } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { DatePickerInput } from '@switchboard/ui/components/date-picker-input'

const updateApiKeySchema = z.object({
  name: z.string().min(3, 'Must have at least 3 characters'),
  description: z.string().optional(),
  expiresAt: z.number().nullable(),
})
type UpdateApiKeyInputs = z.infer<typeof updateApiKeySchema>
type Props = {
  apiKey: Doc<'apiKeys'>
  onSuccess?: () => void
}
export const UpdateApiKeyForm: FC<Props> = ({ apiKey, onSuccess }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    reset,
    setError,
  } = useForm<UpdateApiKeyInputs>({
    defaultValues: {
      name: apiKey.name,
      description: apiKey.description,
      expiresAt: apiKey.expiresAt,
    },
    resolver: zodResolver(updateApiKeySchema),
  })

  const mutationFn = useConvexMutation(
    api.api_keys.mutations.updateApiKeyMutation,
  )
  const { mutate: updateApiKey, isPending } = useMutation({
    mutationFn,
    onError: onFormError(setError),
    onSuccess: () => {
      onSuccess?.()
      reset()
    },
  })

  return (
    <form
      noValidate
      onSubmit={handleSubmit((data) =>
        updateApiKey({
          apiKeyId: apiKey._id,
          name: data.name,
          description: data.description,
          expiresAt: data.expiresAt,
        }),
      )}
    >
      <FieldSet>
        <Field required>
          <FieldLabel htmlFor="key">ApiKey Name</FieldLabel>
          <Input id="name" {...register('name')} placeholder="Main" />
          {errors.name?.message && (
            <FieldError>{errors.name.message}</FieldError>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="key">Description</FieldLabel>
          <Input
            id="description"
            {...register('description')}
            placeholder="Main"
          />
          {errors.description?.message && (
            <FieldError>{errors.description.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="key">Expiry date</FieldLabel>
          <Controller
            control={control}
            name="expiresAt"
            render={({ field }) => {
              return <DatePickerInput {...field} />
            }}
          />

          <FieldError>{errors.expiresAt?.message}</FieldError>
        </Field>

        <Button type="submit" disabled={isPending} className="ml-auto">
          Submit
        </Button>
      </FieldSet>
    </form>
  )
}
