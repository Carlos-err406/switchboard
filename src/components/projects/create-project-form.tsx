import { toastMutationError } from '#/lib/utils.ts'
import { api } from '#convex/_generated/api.js'
import { useConvexMutation } from '@convex-dev/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '#/components/ui/button'
import { Field, FieldError, FieldLabel, FieldSet } from '#/components/ui/field'
import { Input } from '#/components/ui/input'

const createProjectSchema = z.object({
  projectName: z.string().min(3, 'Must have at least 3 characters'),
})
type CreateProjectInputs = z.infer<typeof createProjectSchema>
type Props = {
  onSuccess?: () => void
}
export const CreateProjectForm: FC<Props> = ({ onSuccess }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<CreateProjectInputs>({
    defaultValues: { projectName: '' },
    resolver: zodResolver(createProjectSchema),
  })

  const mutationFn = useConvexMutation(
    api.projects.mutations.createProjectMutation,
  )
  const { mutate: createProject, isPending } = useMutation({
    mutationFn,
    onError: toastMutationError,
    onSuccess: () => {
      reset()
      onSuccess?.()
    },
  })
  return (
    <form
      onSubmit={handleSubmit((data) =>
        createProject({ name: data.projectName }),
      )}
    >
      <FieldSet>
        <Field>
          <FieldLabel htmlFor="projectName">Project Name</FieldLabel>
          <Input
            id="projectName"
            {...register('projectName')}
            placeholder="Acme project"
          />
          {errors.projectName?.message && (
            <FieldError>{errors.projectName.message}</FieldError>
          )}
        </Field>
        <Button type="submit" disabled={isPending} className="ml-auto">
          Submit
        </Button>
      </FieldSet>
    </form>
  )
}
