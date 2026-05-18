import { Badge } from '#/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '#/components/ui/card'
import type { ProjectSummary } from '#/lib/types/inferred.ts'
import { Link } from '@tanstack/react-router'
import { Users2 } from 'lucide-react'
import type { FC } from 'react'
import { Button } from '../ui/button'
import { DeleteProjectDialog } from './delete-project-dialog'
import { RenameProjectDialog } from './rename-project-dialog'

export const ProjectCard: FC<{ project: ProjectSummary }> = ({ project }) => {
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
        <div className="flex flex-wrap gap-2">
          <Badge variant={'outline'}>
            {project.environmentsCount} environment(s)
          </Badge>
          <Badge variant={'outline'}>{project.flagsCount} flags(s)</Badge>
          <Badge variant={'outline'}>{project.membersCount} member(s)</Badge>
        </div>
      </CardContent>

      <CardFooter className="justify-end">
        <Button variant="secondary">
          <Users2 />
        </Button>
        <RenameProjectDialog projectId={project._id} />
        <DeleteProjectDialog projectId={project._id} />
      </CardFooter>
    </Card>
  )
}
