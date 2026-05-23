import { Button } from '#/components/ui/button'
import { Field, FieldError, FieldLabel, FieldSet } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { onFormError } from '#/lib/utils.ts'
import { api } from '#convex/_generated/api.js'
import type { Id } from '#convex/_generated/dataModel.js'
import { useConvexMutation } from '@convex-dev/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const createFlagSchema = z.object({
  key: z.string().min(3, 'Must have at least 3 characters'),
  description: z.string().optional(),
  value: z
    .union([z.string(), z.number(), z.boolean(), z.null()])
    .transform((arg) => {
      if (arg == null || arg === 'null' || arg === '') return null
      if (arg === 'true') return true
      if (arg === 'false') return false
      if (/^\d+$/.test(String(arg))) return Number(arg)
      return String(arg)
    }),
})
type CreateFlagInputs = z.infer<typeof createFlagSchema>
type Props = {
  environmentId: Id<'environments'>
  onSuccess?: () => void
}
export const CreateFlagForm: FC<Props> = ({ environmentId, onSuccess }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
  } = useForm<CreateFlagInputs>({
    defaultValues: { key: '', description: '', value: '' },
    resolver: zodResolver(createFlagSchema),
  })

  const mutationFn = useConvexMutation(api.flags.mutations.createFlagMutation)
  const { mutate: createFlag, isPending } = useMutation({
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
        createFlag({
          key: data.key,
          value: data.value,
          description: data.description,
          environmentId,
        }),
      )}
    >
      <FieldSet>
        <Field required>
          <FieldLabel htmlFor="key">Flag Key</FieldLabel>
          <Input id="key" {...register('key')} placeholder="logs.enable" />
          {errors.key?.message && <FieldError>{errors.key.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="value">Flag Value</FieldLabel>
          <Input
            id="value"
            {...register('value')}
            placeholder={'OFF | null | true | 99 | hi'}
          />
          {errors.value?.message && (
            <FieldError>{errors.value.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Flag Description</FieldLabel>
          <Input
            id="description"
            {...register('description')}
            placeholder="Enables the logs client-side"
          />
          {errors.description?.message && (
            <FieldError>{errors.description.message}</FieldError>
          )}
        </Field>
        <Button type="submit" disabled={isPending} className="ml-auto">
          Submit
        </Button>
      </FieldSet>
    </form>
  )
}
