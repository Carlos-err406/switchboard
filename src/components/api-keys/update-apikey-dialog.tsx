import { buttonVariants } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import type { Doc } from '#convex/_generated/dataModel.js'
import { Pencil } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'
import { UpdateApiKeyForm } from './update-apikey-form'

export const UpdateApiKeyDialog: FC<{ apiKey: Doc<'apiKeys'> }> = ({
  apiKey,
}) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger className={buttonVariants({ variant: 'secondary' })}>
            <Pencil />
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">Update Api key</TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Api key</DialogTitle>
          <DialogDescription>
            Update the api key for the current environment.
          </DialogDescription>
        </DialogHeader>
        <UpdateApiKeyForm apiKey={apiKey} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
