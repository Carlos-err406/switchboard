import { Button } from '#/components/ui/button'
import { toastMutationError } from '#/lib/utils.ts'
import { api } from '#convex/_generated/api.js'
import { useConvexMutation } from '@convex-dev/react-query'
import { useMutation } from '@tanstack/react-query'
import type { FC } from 'react'

export const CreateProjectButton: FC = () => {
  const mutationFn = useConvexMutation(api.models.projects.createProject)
  const { mutate: createProject, isPending } = useMutation({
    mutationFn,
    onError: toastMutationError,
  })

  return (
    <Button
      disabled={isPending}
      onClick={async () => createProject({ name: 'ASD' })}
    >
      Create project
    </Button>
  )
}
