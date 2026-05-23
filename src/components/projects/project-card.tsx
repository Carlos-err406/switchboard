import { Badge } from '#/components/ui/badge'
import { buttonVariants } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import type { ProjectSummary } from '#/lib/types/inferred.ts'
import { Link } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { ExternalLink, Folder } from 'lucide-react'
import type { FC } from 'react'
import { DeleteProjectDialog } from './delete-project-dialog'
import { RenameProjectDialog } from './rename-project-dialog'

export const ProjectCard: FC<{ project: ProjectSummary }> = ({ project }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Tooltip>
            <TooltipTrigger className="text-start max-w-[calc(var(--min-col-size)-80px)] truncate line-clamp-1">
              <Link
                to="/projects/$projectId"
                params={{ projectId: project._id }}
                className="flex items-center gap-2"
              >
                <Folder className="size-4" /> {project.name}
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Open project</TooltipContent>
          </Tooltip>
        </CardTitle>
        <CardDescription>
          {dayjs(project._creationTime).format('MMM DD, YYYY')}
        </CardDescription>
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
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/projects/$projectId"
              params={{ projectId: project._id }}
              className={buttonVariants({ variant: 'secondary' })}
            >
              <ExternalLink />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="bottom">Go to project</TooltipContent>
        </Tooltip>
        <RenameProjectDialog project={project} />
        <DeleteProjectDialog project={project} />
      </CardFooter>
    </Card>
  )
}
