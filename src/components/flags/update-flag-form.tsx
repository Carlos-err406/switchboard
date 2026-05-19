import { Button } from '#/components/ui/button'
import { Field, FieldError, FieldLabel, FieldSet } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { toastMutationError } from '#/lib/utils.ts'
import { api } from '#convex/_generated/api.js'
import type { Doc } from '#convex/_generated/dataModel.js'
import { useConvexMutation } from '@convex-dev/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const updateFlagSchema = z.object({
  key: z.string().min(3, 'Must have at least 3 characters'),
  description: z.string().optional(),
  value: z
    .union([z.string(), z.number(), z.boolean(), z.null()])
    .transform((arg) =>
      arg === 'null'
        ? null
        : arg === 'true'
          ? true
          : arg === 'false'
            ? false
            : isNaN(Number(arg))
              ? arg
              : Number(arg),
    ),
})
type UpdateFlagInputs = z.infer<typeof updateFlagSchema>
type Props = {
  flag: Doc<'flags'>
  onSuccess?: () => void
}
export const UpdateFlagForm: FC<Props> = ({ flag, onSuccess }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<UpdateFlagInputs>({
    defaultValues: {
      key: flag.key,
      description: flag.description,
      value: flag.value,
    },
    resolver: zodResolver(updateFlagSchema),
  })

  const mutationFn = useConvexMutation(api.flags.mutations.updateFlagMutation)
  const { mutate: updateFlag, isPending } = useMutation({
    mutationFn,
    onError: toastMutationError,
    onSuccess: () => {
      onSuccess?.()
      reset()
    },
  })

  return (
    <form
      onSubmit={handleSubmit((data) =>
        updateFlag({
          flagId: flag._id,
          key: data.key,
          value: data.value,
          description: data.description,
        }),
      )}
    >
      <FieldSet>
        <Field>
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
