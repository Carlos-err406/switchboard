import { Button, buttonVariants } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { Field, FieldError, FieldLabel, FieldSet } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import { toastMutationError } from '#/lib/utils.ts'
import { api } from '#convex/_generated/api.js'
import type { Doc } from '#convex/_generated/dataModel.js'
import { useConvexMutation } from '@convex-dev/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const renameProjectSchema = z.object({
  projectName: z.string().min(3, 'Must have at least 3 characters'),
})
type RenameProjectInputs = z.infer<typeof renameProjectSchema>

export const RenameProjectDialog: FC<{ project: Doc<'projects'> }> = ({
  project,
}) => {
  const [open, setOpen] = useState(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<RenameProjectInputs>({
    defaultValues: { projectName: project.name },
    resolver: zodResolver(renameProjectSchema),
  })

  const mutationFn = useConvexMutation(
    api.projects.mutations.renameProjectMutation,
  )
  const { mutate: renameProject, isPending } = useMutation({
    mutationFn,
    onError: toastMutationError,
    onSuccess: () => {
      setOpen(false)
      reset()
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger className={buttonVariants({ variant: 'secondary' })}>
            <Pencil />
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">Rename project</TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
        </DialogHeader>
        <form
          noValidate
          onSubmit={handleSubmit((data) =>
            renameProject({ id: project._id, name: data.projectName }),
          )}
        >
          <FieldSet>
            <Field required>
              <FieldLabel htmlFor="projectName">Project Name (new)</FieldLabel>
              <Input
                required
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
