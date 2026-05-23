import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { useState } from 'react'
import type { FC } from 'react'
import { InviteUserForm } from './invite-user-form'
import { Mail } from 'lucide-react'
import { buttonVariants } from '../ui/button'
import { useHasPermissions } from '#/hooks/use-has-permission.ts'

export const InviteUserDialog: FC = () => {
  const [open, setOpen] = useState(false)
  const canInvite = useHasPermissions(['users.invite'])
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={buttonVariants({ variant: 'default' })}
        disabled={!canInvite}
      >
        <Mail /> Invite user
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite user</DialogTitle>
          <DialogDescription>
            Invite users and assign platform permissions. Using individual
            accounts improves audit logs and accountability.
          </DialogDescription>
        </DialogHeader>
        <InviteUserForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
