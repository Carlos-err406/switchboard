import { buttonVariants } from '@switchboard/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@switchboard/ui/components/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@switchboard/ui/components/tooltip'
import type { Doc } from '@convex/_generated/dataModel.js'
import { Pencil } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'
import { UpdateFlagForm } from './update-flag-form'

export const UpdateFlagDialog: FC<{ flag: Doc<'flags'> }> = ({ flag }) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger className={buttonVariants({ variant: 'secondary' })}>
            <Pencil />
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">Update flag</TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update flag</DialogTitle>
          <DialogDescription>
            Update a feature flag for the current environment. Values are
            inferred to null, boolean, number or "string"
          </DialogDescription>
        </DialogHeader>
        <UpdateFlagForm flag={flag} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
