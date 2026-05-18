import { Button, buttonVariants } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { toastMutationError } from '#/lib/utils.ts'
import { api } from '#convex/_generated/api.js'
import type { Id } from '#convex/_generated/dataModel.js'
import { useConvexMutation } from '@convex-dev/react-query'
import { useMutation } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'

export const DeleteProjectDialog: FC<{ projectId: Id<'projects'> }> = ({
  projectId,
}) => {
  const [open, setOpen] = useState(false)
  const mutationFn = useConvexMutation(
    api.models.projects.deleteProjectMutation,
  )
  const { mutate: deleteProject, isPending } = useMutation({
    mutationFn,
    onError: toastMutationError,
    onSuccess: () => setOpen(false),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ variant: 'destructive' })}>
        <Trash2 />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription className="prose">
            Are you sure you want to delete this project? All{' '}
            <strong>flags</strong> and <strong>api keys</strong> will be deleted
            and <strong>members</strong> will be unassigned automatically.{' '}
            <br />
            <strong className="text-destructive">
              This action is irreversible.
            </strong>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => deleteProject({ id: projectId })}
            variant={'destructive'}
            disabled={isPending}
            className="ml-auto"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
