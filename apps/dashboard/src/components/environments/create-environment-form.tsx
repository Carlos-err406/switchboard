import { onFormError } from '#/lib/utils.ts'
import { api } from '@convex/_generated/api.js'
import { useConvexMutation } from '@convex-dev/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@switchboard/ui/components/button'
import { Field, FieldError, FieldLabel, FieldSet } from '@switchboard/ui/components/field'
import { Input } from '@switchboard/ui/components/input'
import type { Id } from '@convex/_generated/dataModel.js'
import { toast } from 'sonner'
import type { FunctionReturnType } from 'convex/server'

const createEnvironmentSchema = z.object({
  name: z.string().min(3, 'Must have at least 3 characters'),
  description: z.string().optional(),
})
type CreateEnvironmentInputs = z.infer<typeof createEnvironmentSchema>
type Props = {
  onSuccess?: (
    result: FunctionReturnType<
      typeof api.environments.mutations.createEnvironmentMutation
    >,
  ) => void
  projectId: Id<'projects'>
}
export const CreateEnvironmentForm: FC<Props> = ({ onSuccess, projectId }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
  } = useForm<CreateEnvironmentInputs>({
    defaultValues: { name: '', description: '' },
    resolver: zodResolver(createEnvironmentSchema),
  })

  const mutationFn = useConvexMutation(
    api.environments.mutations.createEnvironmentMutation,
  )
  const { mutate: createEnvironment, isPending } = useMutation({
    mutationFn,
    onError: onFormError(setError),
    onSuccess: (result) => {
      reset()
      toast.success('New environment created')
      onSuccess?.(result)
    },
  })
  return (
    <form
      noValidate
      onSubmit={handleSubmit((data) =>
        createEnvironment({
          name: data.name,
          description: data.description,
          projectId,
        }),
      )}
    >
      <FieldSet>
        <Field required>
          <FieldLabel htmlFor="name">Environment name</FieldLabel>
          <Input id="name" {...register('name')} placeholder="CI/CID" />
          {errors.name?.message && (
            <FieldError>{errors.name.message}</FieldError>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="description">Environment description</FieldLabel>
          <Input
            id="description"
            {...register('description')}
            placeholder="to use in CI/CD pipelines"
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
