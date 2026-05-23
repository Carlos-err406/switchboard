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
import { Shield } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'
import { UpdatePermissionsForm } from './update-permissions-form'

export const UpdatePermissionsDialog: FC<{ user: Doc<'users'> }> = ({
  user,
}) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger
            className={buttonVariants({ variant: 'secondary' })}
            disabled={user.role === 'admin'}
          >
            <Shield />
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">Update permissions</TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update permissions</DialogTitle>
          <DialogDescription>
            Update platform permissions for {user.email}.
          </DialogDescription>
        </DialogHeader>
        <UpdatePermissionsForm user={user} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
