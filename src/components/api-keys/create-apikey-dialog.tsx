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
import { Key } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'
import { CreateApiKeyForm } from './create-apikey-form'

export const CreateApiKeyDialog: FC<{
  environmentId: Id<'environments'>
}> = ({ environmentId }) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ variant: 'default' })}>
        <Key /> Create ApiKey
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Api Key creation</DialogTitle>
          <DialogDescription>
            Create an api key so you can query this environment's feature flags
            securely
          </DialogDescription>
        </DialogHeader>
        <CreateApiKeyForm
          environmentId={environmentId}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
