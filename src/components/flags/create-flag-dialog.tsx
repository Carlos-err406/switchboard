import { buttonVariants } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import type { Id } from '#convex/_generated/dataModel.js'
import { Flag } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'
import { CreateFlagForm } from './create-flag-form'

export const CreateFlagDialog: FC<{
  projectId: Id<'projects'>
  environmentId: Id<'environments'>
}> = ({ projectId, environmentId }) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ variant: 'default' })}>
        <Flag /> Create Flag
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Flag creation</DialogTitle>
          <DialogDescription>
            Create a feature flag for the current environment. Values are
            inferred to null, boolean, number or "string"
          </DialogDescription>
        </DialogHeader>
        <CreateFlagForm
          projectId={projectId}
          environmentId={environmentId}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
