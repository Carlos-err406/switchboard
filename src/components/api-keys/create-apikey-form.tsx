import { Button } from '#/components/ui/button'
import { Field, FieldError, FieldLabel, FieldSet } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { toastMutationError } from '#/lib/utils.ts'
import { api } from '#convex/_generated/api.js'
import type { Id } from '#convex/_generated/dataModel.js'
import { useConvexMutation } from '@convex-dev/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import type { FunctionReturnType } from 'convex/server'
import type { FC } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { DatePickerInput } from '../ui/date-picker-input'
import { toast } from 'sonner'

const createApiKeySchema = z.object({
  name: z.string().min(3, 'Must have at least 3 characters'),
  description: z.string().optional(),
  expiresAt: z.number().nullable(),
})
type CreateApiKeyInputs = z.infer<typeof createApiKeySchema>
type Props = {
  environmentId: Id<'environments'>
  onSuccess?: (
    result: FunctionReturnType<
      typeof api.api_keys.mutations.createApiKeyMutation
    >,
  ) => void
}
export const CreateApiKeyForm: FC<Props> = ({ environmentId, onSuccess }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control,
  } = useForm<CreateApiKeyInputs>({
    defaultValues: { name: '', description: '', expiresAt: null },
    resolver: zodResolver(createApiKeySchema),
  })

  const mutationFn = useConvexMutation(
    api.api_keys.mutations.createApiKeyMutation,
  )
  const { mutate: createApiKey, isPending } = useMutation({
    mutationFn,
    onError: toastMutationError,
    onSuccess: (apiKey) => {
      toast.info('Copy your api key here', {
        description: 'You will not be able to get it from anywhere else',
        duration: Infinity,
        action: {
          label: 'Copy',
          onClick: () => {
            navigator.clipboard.writeText(apiKey)
          },
        },
      })
      onSuccess?.(apiKey)
      reset()
    },
  })

  return (
    <form
      onSubmit={handleSubmit((data) =>
        createApiKey({
          name: data.name,
          description: data.description,
          expiresAt: data.expiresAt,
          environmentId,
        }),
      )}
    >
      <FieldSet>
        <Field required>
          <FieldLabel htmlFor="name">ApiKey Name</FieldLabel>
          <Input id="name" {...register('name')} placeholder="main" />
          {errors.name?.message && (
            <FieldError>{errors.name.message}</FieldError>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Input
            id="description"
            {...register('description')}
            placeholder="main"
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
