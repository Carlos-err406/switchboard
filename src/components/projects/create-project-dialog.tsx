import { Button, buttonVariants } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { toastMutationError } from '#/lib/utils.ts'
import { api } from '#convex/_generated/api.js'
import { useConvexMutation } from '@convex-dev/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { FolderCode } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Field, FieldError, FieldLabel, FieldSet } from '#/components/ui/field'

const createProjectSchema = z.object({
  projectName: z.string().min(3, 'Must have at least 3 characters'),
})
type CreateProjectInputs = z.infer<typeof createProjectSchema>

export const CreateProjectDialog: FC = () => {
  const [open, setOpen] = useState(false)

  const mutationFn = useConvexMutation(
    api.models.projects.createProjectMutation,
  )
  const { mutate: createProject, isPending } = useMutation({
    mutationFn,
    onError: toastMutationError,
    onSuccess: () => setOpen(false),
  })

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateProjectInputs>({
    defaultValues: { projectName: '' },
    resolver: zodResolver(createProjectSchema),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ variant: 'default' })}>
        <FolderCode /> Create Project
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Project creation</DialogTitle>
          <DialogDescription>
            Use projects to group flags, users and api keys
          </DialogDescription>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  )
}
