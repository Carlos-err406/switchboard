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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import { toastMutationError } from '#/lib/utils.ts'
import { api } from '#convex/_generated/api.js'
import type { Doc } from '#convex/_generated/dataModel.js'
import { useConvexMutation } from '@convex-dev/react-query'
import { useMutation } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'

export const DeleteApiKeyDialog: FC<{ apiKey: Doc<'apiKeys'> }> = ({ apiKey }) => {
  const [open, setOpen] = useState(false)
  const mutationFn = useConvexMutation(api.api_keys.mutations.deleteApiKeyMutation)
  const { mutate: deleteApiKey, isPending } = useMutation({
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
        <TooltipContent side="bottom">Delete Api Key</TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete apiKey</DialogTitle>
          <DialogDescription className="prose">
            Are you sure you want to delete this apiKey? It will only be deleted
            from the current environment. <br />
            <strong className="text-destructive">
              This action is irreversible.
            </strong>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => deleteApiKey({ apiKeyId: apiKey._id })}
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
