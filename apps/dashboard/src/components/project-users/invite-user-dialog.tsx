import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@switchboard/ui/components/dialog'
import type { FC } from 'react'
import { InviteUserForm } from './invite-user-form'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}
export const CreateUserDialog: FC<Props> = ({ open, setOpen }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User creation</DialogTitle>
          <DialogDescription>
            Invite users and assign platform permissions so they can create
            projects and manage access. Using individual accounts improves audit
            logs and accountability.
          </DialogDescription>
        </DialogHeader>
        <InviteUserForm
          onSuccess={() => {
            setOpen(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
