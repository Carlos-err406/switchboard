import { Button, buttonVariants } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { toastMutationError } from '#/lib/utils.ts'
import { api } from '#convex/_generated/api.js'
import { useConvexMutation } from '@convex-dev/react-query'
import { useMutation } from '@tanstack/react-query'
import type { FC } from 'react'
import { useState } from 'react'

export const CreateProjectDialog: FC = () => {
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)
  
  const mutationFn = useConvexMutation(api.models.projects.createProject)
  const { mutate: createProject, isPending } = useMutation({
    mutationFn,
    onError: toastMutationError,
    onSuccess: () => setOpen(false),
  })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ variant: 'default' })}>
        Create Project
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Project creation</DialogTitle>
          <DialogDescription>
            Use projects to group flags, users and api keys
          </DialogDescription>
        </DialogHeader>
        <Label className="grid grid-cols-1">
          <p>Project Name</p>
          <Input
            name="projectName"
            value={name}
            type="text"
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </Label>
        <DialogFooter>
          <Button
            type="submit"
            disabled={isPending}
            onClick={() => createProject({ name })}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
