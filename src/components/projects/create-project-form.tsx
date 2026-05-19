import { Button } from '#/components/ui/button'
import { Field, FieldError, FieldLabel, FieldSet } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { toastMutationError } from '#/lib/utils.ts'
import { api } from '#convex/_generated/api.js'
import { useConvexMutation } from '@convex-dev/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import type { FunctionReturnType } from 'convex/server'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const createProjectSchema = z.object({
  name: z.string().min(3, 'Must have at least 3 characters'),
})
type CreateProjectInputs = z.infer<typeof createProjectSchema>
type Props = {
  onSuccess?: (
    result: FunctionReturnType<
      typeof api.projects.mutations.createProjectMutation
    >,
  ) => void
}
export const CreateProjectForm: FC<Props> = ({ onSuccess }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<CreateProjectInputs>({
    defaultValues: { name: '' },
    resolver: zodResolver(createProjectSchema),
  })

  const mutationFn = useConvexMutation(
    api.projects.mutations.createProjectMutation,
  )
  const { mutate: createProject, isPending } = useMutation({
    mutationFn,
    onError: toastMutationError,
    onSuccess: (result) => {
      reset()
      onSuccess?.(result)
    },
  })
  return (
    <form onSubmit={handleSubmit((data) => createProject({ name: data.name }))}>
      <FieldSet>
        <Field required>
          <FieldLabel htmlFor="name">Project Name</FieldLabel>
          <Input id="name" {...register('name')} placeholder="Acme project" />
          {errors.name?.message && (
            <FieldError>{errors.name.message}</FieldError>
          )}
        </Field>
        <Button type="submit" disabled={isPending} className="ml-auto">
          Submit
        </Button>
      </FieldSet>
    </form>
  )
}
