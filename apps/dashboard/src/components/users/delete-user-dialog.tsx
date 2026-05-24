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

export const DeleteUserDialog: FC<{ user: Doc<'users'> }> = ({ user }) => {
  const [open, setOpen] = useState(false)
  const mutationFn = useConvexMutation(api.users.mutations.deleteUserMutation)
  const { mutate: deleteUser, isPending } = useMutation({
    mutationFn,
    onError: toastMutationError,
    onSuccess: () => setOpen(false),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger
            className={buttonVariants({ variant: 'destructive' })}
            disabled={user.role === 'admin'}
          >
            <Trash2 />
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">Delete user</TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete user</DialogTitle>
          <DialogDescription className="prose">
            Are you sure you want to delete {user.email}? will be removed from
            all projects automatically. <br />
            <strong className="text-destructive">
              This action is irreversible.
            </strong>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => deleteUser({ id: user._id })}
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
