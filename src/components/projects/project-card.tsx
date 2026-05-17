import { Button } from '#/components/ui/button'
import { Card, CardFooter, CardHeader } from '#/components/ui/card'
import { toastMutationError } from '#/lib/utils.ts'
import { api } from '#convex/_generated/api.js'
import { useConvexMutation } from '@convex-dev/react-query'
import { useMutation } from '@tanstack/react-query'
import type { FunctionReturnType } from 'convex/server'
import { Pencil, Trash2 } from 'lucide-react'
import type { FC } from 'react'
import { Badge } from '../ui/badge'

type UserProject = FunctionReturnType<
  typeof api.models.projects.getUserProjects
>[number]

export const ProjectCard: FC<{ project: UserProject }> = ({ project }) => {
  const deleteMutationFn = useConvexMutation(api.models.projects.deleteProject)
  const { mutate: deleteProject, isPending } = useMutation({
    mutationFn: deleteMutationFn,
    onError: toastMutationError,
  })

  return (
    <Card key={project._id} className="shadow-md">
      <CardHeader>
        {project.name}
        <Badge variant={'outline'}>
          {project.environmentsCount} environment(s)
        </Badge>
        <Badge variant={'outline'}>{project.flagsCount} flags(s)</Badge>
      </CardHeader>

      <CardFooter className="justify-end">
        <Button variant={'secondary'}>
          <Pencil />
        </Button>
        <Button
          variant={'destructive'}
          disabled={isPending}
          onClick={(e) => {
            e.preventDefault()
            deleteProject({ id: project._id })
          }}
        >
          <Trash2 />
        </Button>
      </CardFooter>
    </Card>
  )
}
