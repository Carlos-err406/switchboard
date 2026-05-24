import { Button } from '@switchboard/ui/components/button'
import { Field, FieldError, FieldLabel, FieldSet } from '@switchboard/ui/components/field'
import { Input } from '@switchboard/ui/components/input'
import { onFormError } from '#/lib/utils.ts'
import { api } from '@convex/_generated/api.js'
import type { Doc } from '@convex/_generated/dataModel.js'
import { useConvexMutation } from '@convex-dev/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import type { FunctionReturnType } from 'convex/server'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const updateEnvironmentSchema = z.object({
  name: z.string().min(3, 'Must have at least 3 characters'),
  description: z.string().optional(),
})
type UpdateEnvironmentInputs = z.infer<typeof updateEnvironmentSchema>

type Props = {
  environment: Doc<'environments'>
  onSuccess?: (
    result: FunctionReturnType<
      typeof api.environments.mutations.updateEnvironmentMutation
    >,
  ) => void
}
export const UpdateEnvironmentForm: FC<Props> = ({
  environment,
  onSuccess,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
  } = useForm<UpdateEnvironmentInputs>({
    defaultValues: {
      name: environment.name,
      description: environment.description,
    },
    resolver: zodResolver(updateEnvironmentSchema),
  })

  const mutationFn = useConvexMutation(
    api.environments.mutations.updateEnvironmentMutation,
  )
  const { mutate: updateEnvironment, isPending } = useMutation({
    mutationFn,
    onError: onFormError(setError),
    onSuccess: (result) => {
      onSuccess?.(result)
      reset()
    },
  })

  return (
    <form
      noValidate
      onSubmit={handleSubmit((data) =>
        updateEnvironment({
          environmentId: environment._id,
          name: data.name,
          description: data.description,
        }),
      )}
    >
      <FieldSet>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            {...register('name')}
            placeholder="Acme environment"
          />
          {errors.name?.message && (
            <FieldError>{errors.name.message}</FieldError>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Input id="description" {...register('description')} />
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
