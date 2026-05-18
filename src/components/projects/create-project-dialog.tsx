import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '#/components/ui/dialog';
import type { FC } from 'react';
import { CreateProjectForm } from './create-project-form';

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}
export const CreateProjectDialog: FC<Props> = ({ open, setOpen }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Project creation</DialogTitle>
          <DialogDescription>
            Use projects to group flags, users and api keys
          </DialogDescription>
        </DialogHeader>
        <CreateProjectForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
