import { toastMutationError } from '#/lib/utils.ts'
import { api } from '#convex/_generated/api.js'
import { useConvexMutation } from '@convex-dev/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../ui/button'
import { Field, FieldError, FieldLabel, FieldSet } from '../ui/field'
import { Input } from '../ui/input'
import type { Id } from '#convex/_generated/dataModel.js'
import { toast } from 'sonner'

const createEnvironmentSchema = z.object({
  environmentName: z.string().min(3, 'Must have at least 3 characters'),
})
type CreateEnvironmentInputs = z.infer<typeof createEnvironmentSchema>
type Props = {
  onSuccess?: (id: Id<'environments'>) => void
  projectId: Id<'projects'>
}
export const CreateEnvironmentForm: FC<Props> = ({ onSuccess, projectId }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<CreateEnvironmentInputs>({
    defaultValues: { environmentName: '' },
    resolver: zodResolver(createEnvironmentSchema),
  })

  const mutationFn = useConvexMutation(
    api.environments.mutations.createEnvironmentMutation,
  )
  const { mutate: createEnvironment, isPending } = useMutation({
    mutationFn,
    onError: toastMutationError,
    onSuccess: (data) => {
      reset()
      toast.success('New environment created')
      onSuccess?.(data)
    },
  })
  return (
    <form
      onSubmit={handleSubmit((data) =>
        createEnvironment({ name: data.environmentName, projectId }),
      )}
    >
      <FieldSet>
        <Field>
          <FieldLabel htmlFor="environmentName">Environment Name</FieldLabel>
          <Input
            id="environmentName"
            {...register('environmentName')}
            placeholder="Production"
          />
          {errors.environmentName?.message && (
            <FieldError>{errors.environmentName.message}</FieldError>
          )}
        </Field>
        <Button type="submit" disabled={isPending} className="ml-auto">
          Submit
        </Button>
      </FieldSet>
    </form>
  )
}
