import { buttonVariants } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import type { api } from '#convex/_generated/api.js'
import type { Id } from '#convex/_generated/dataModel.js'
import type { FunctionReturnType } from 'convex/server'
import { Key } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'
import { CopyApiKeyDialog } from './copy-apikey-dialog'
import { CreateApiKeyForm } from './create-apikey-form'

export const CreateApiKeyDialog: FC<{
  environmentId: Id<'environments'>
}> = ({ environmentId }) => {
  const [open, setOpen] = useState(false)
  const [copyResult, setCopyResult] = useState<FunctionReturnType<
    typeof api.api_keys.mutations.createApiKeyMutation
  > | null>(null)

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className={buttonVariants({ variant: 'default' })}>
          <Key /> Create ApiKey
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Api key creation</DialogTitle>
            <DialogDescription>
              Create an api key so you can query this environment's feature
              flags securely
            </DialogDescription>
          </DialogHeader>
          <CreateApiKeyForm
            environmentId={environmentId}
            onSuccess={(result) => {
              setOpen(false)
              setTimeout(() => setCopyResult(result), 150)
            }}
          />
        </DialogContent>
      </Dialog>
      <CopyApiKeyDialog
        title="Api key created"
        value={copyResult}
        onClose={() => setCopyResult(null)}
      />
    </>
  )
}
