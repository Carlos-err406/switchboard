import { Button, buttonVariants } from '#/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '#/components/ui/dialog';
import { Input } from '#/components/ui/input';
import { toastMutationError } from '#/lib/utils.ts';
import { api } from '#convex/_generated/api.js';
import type { Id } from '#convex/_generated/dataModel.js';
import { useConvexMutation } from '@convex-dev/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useQuery } from 'convex/react';
import { Pencil } from 'lucide-react';
import type { FC } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Field, FieldError, FieldLabel, FieldSet } from '../ui/field';

const renameProjectSchema = z.object({
  projectName: z.string().min(3, 'Must have at least 3 characters'),
})
type RenameProjectInputs = z.infer<typeof renameProjectSchema>

export const RenameProjectDialog: FC<{ projectId: Id<'projects'> }> = ({
  projectId,
}) => {
  const [open, setOpen] = useState(false)
  const project = useQuery(api.models.projects.getUserProjectQuery, {
    id: projectId,
  })
  const mutationFn = useConvexMutation(
    api.models.projects.updateProjectNameMutation,
  )
  const { mutate: renameProject, isPending } = useMutation({
    mutationFn,
    onError: toastMutationError,
    onSuccess: () => setOpen(false),
  })

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<RenameProjectInputs>({
    defaultValues: { projectName: project?.name ?? '' },
    resolver: zodResolver(renameProjectSchema),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ variant: 'secondary' })}>
        <Pencil />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((data) =>
            renameProject({ id: projectId, name: data.projectName }),
          )}
        >
          <FieldSet>
            <Field>
              <FieldLabel htmlFor="projectName">Project Name (new)</FieldLabel>
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
