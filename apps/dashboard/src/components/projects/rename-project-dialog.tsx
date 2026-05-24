import { Button, buttonVariants } from '@switchboard/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@switchboard/ui/components/dialog'
import { Field, FieldError, FieldLabel, FieldSet } from '@switchboard/ui/components/field'
import { Input } from '@switchboard/ui/components/input'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@switchboard/ui/components/tooltip'
import { onFormError } from '#/lib/utils.ts'
import { api } from '@convex/_generated/api.js'
import type { Doc } from '@convex/_generated/dataModel.js'
import { useConvexMutation } from '@convex-dev/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const renameProjectSchema = z.object({
  name: z.string().min(3, 'Must have at least 3 characters'),
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
    setError,
  } = useForm<RenameProjectInputs>({
    defaultValues: { name: project.name },
    resolver: zodResolver(renameProjectSchema),
  })

  const mutationFn = useConvexMutation(
    api.projects.mutations.renameProjectMutation,
  )
  const { mutate: renameProject, isPending } = useMutation({
    mutationFn,
    onError: onFormError(setError),
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
            renameProject({ id: project._id, name: data.name }),
          )}
        >
          <FieldSet>
            <Field required>
              <FieldLabel htmlFor="name">Project Name (new)</FieldLabel>
              <Input
                required
                id="name"
                {...register('name')}
                placeholder="Acme project"
              />
              {errors.name?.message && (
                <FieldError>{errors.name.message}</FieldError>
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
