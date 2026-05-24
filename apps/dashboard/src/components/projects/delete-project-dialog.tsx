import { Button, buttonVariants } from '@switchboard/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@switchboard/ui/components/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@switchboard/ui/components/tooltip'
import { toastMutationError } from '#/lib/utils.ts'
import { api } from '@convex/_generated/api.js'
import type { Doc } from '@convex/_generated/dataModel.js'
import { useConvexMutation } from '@convex-dev/react-query'
import { useMutation } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'

export const DeleteProjectDialog: FC<{ project: Doc<'projects'> }> = ({
  project,
}) => {
  const [open, setOpen] = useState(false)
  const mutationFn = useConvexMutation(
    api.projects.mutations.deleteProjectMutation,
  )
  const { mutate: deleteProject, isPending } = useMutation({
    mutationFn,
    onError: toastMutationError,
    onSuccess: () => setOpen(false),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger className={buttonVariants({ variant: 'destructive' })}>
            <Trash2 />
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">Delete project</TooltipContent>
      </Tooltip>
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
            onClick={() => deleteProject({ id: project._id })}
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
