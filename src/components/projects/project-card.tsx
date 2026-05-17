import { Card, CardContent, CardFooter, CardHeader } from '#/components/ui/card'
import type { api } from '#convex/_generated/api.js'
import { Link } from '@tanstack/react-router'
import type { FunctionReturnType } from 'convex/server'
import type { FC } from 'react'
import { Badge } from '../ui/badge'
import { DeleteProjectDialog } from './delete-project-dialog'
import { RenameProjectDialog } from './rename-project-dialog'

type UserProject = FunctionReturnType<
  typeof api.models.projects.getUserProjectsQuery
>[number]

export const ProjectCard: FC<{ project: UserProject }> = ({ project }) => {
  return (
    <Card key={project._id} className="shadow-md">
      <CardHeader>
        <Link
          to="/projects/$projectId"
          params={{ projectId: project._id }}
          className="w-fit"
        >
          {project.name}
        </Link>
      </CardHeader>
      <CardContent>
        <Badge variant={'outline'}>
          {project.environmentsCount} environment(s)
        </Badge>
        <Badge variant={'outline'}>{project.flagsCount} flags(s)</Badge>
      </CardContent>

      <CardFooter className="justify-end">
        <RenameProjectDialog projectId={project._id} />
        <DeleteProjectDialog projectId={project._id} />
      </CardFooter>
    </Card>
  )
}
