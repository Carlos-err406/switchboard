import { Button } from '#/components/ui/button'
import { Field, FieldError, FieldLabel, FieldSet } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { toastMutationError } from '#/lib/utils.ts'
import { api } from '#convex/_generated/api.js'
import type { Id } from '#convex/_generated/dataModel.js'
import { useConvexMutation } from '@convex-dev/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const createFlagSchema = z.object({
  flagKey: z.string().min(3, 'Must have at least 3 characters'),
  flagDescription: z.string().optional(),
  flagValue: z
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
type CreateFlagInputs = z.infer<typeof createFlagSchema>
type Props = {
  environmentId: Id<'environments'>
  projectId: Id<'projects'>
  onSuccess?: () => void
}
export const CreateFlagForm: FC<Props> = ({
  environmentId,
  projectId,
  onSuccess,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<CreateFlagInputs>({
    defaultValues: { flagKey: '', flagDescription: '', flagValue: null },
    resolver: zodResolver(createFlagSchema),
  })

  const mutationFn = useConvexMutation(api.flags.mutations.createFlagMutation)
  const { mutate: createFlag, isPending } = useMutation({
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
        createFlag({
          key: data.flagKey,
          value: data.flagValue,
          description: data.flagDescription,
          projectId,
          environmentId,
        }),
      )}
    >
      <FieldSet>
        <Field>
          <FieldLabel htmlFor="flagName">Flag Key</FieldLabel>
          <Input
            id="flagKey"
            {...register('flagKey')}
            placeholder="logs.enable"
          />
          {errors.flagKey?.message && (
            <FieldError>{errors.flagKey.message}</FieldError>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="flagValue">Flag Value</FieldLabel>
          <Input
            id="flagValue"
            {...register('flagValue')}
            placeholder="ON / OFF / null / true / 99 / hello world"
          />
          {errors.flagValue?.message && (
            <FieldError>{errors.flagValue.message}</FieldError>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="flagName">Flag Description</FieldLabel>
          <Input
            id="flagDescription"
            {...register('flagDescription')}
            placeholder="Enables the logs client-side"
          />
          {errors.flagDescription?.message && (
            <FieldError>{errors.flagDescription.message}</FieldError>
          )}
        </Field>
        <Button type="submit" disabled={isPending} className="ml-auto">
          Submit
        </Button>
      </FieldSet>
    </form>
  )
}
