import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import type { Id } from '#convex/_generated/dataModel.js'
import { useNavigate } from '@tanstack/react-router'
import type { FC } from 'react'
import { CreateEnvironmentForm } from './create-environment-form'

export const CreateEnvironmentDialog: FC<{
  projectId: Id<'projects'>
  open: boolean
  setOpen: (open: boolean) => void
}> = ({ projectId, open, setOpen }) => {
  const navigate = useNavigate()
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new environment</DialogTitle>
          <DialogDescription>
            Use environments to group flags, usual names are{' '}
            <strong>Production</strong> or <strong>Staging</strong>
          </DialogDescription>
        </DialogHeader>
        <CreateEnvironmentForm
          projectId={projectId}
          onSuccess={(id) => {
            setOpen(false)
            navigate({ to: '.', search: { environment: id } })
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
