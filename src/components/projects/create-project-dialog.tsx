import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import type { FC } from 'react'
import { CreateProjectForm } from './create-project-form'
import { useNavigate } from '@tanstack/react-router'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}
export const CreateProjectDialog: FC<Props> = ({ open, setOpen }) => {
  const navigate = useNavigate()
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Project creation</DialogTitle>
          <DialogDescription>
            Use projects to group flags, users and api keys
          </DialogDescription>
        </DialogHeader>
        <CreateProjectForm
          onSuccess={(projectId) => {
            setOpen(false)
            navigate({ to: '/projects/$projectId', params: { projectId } })
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
