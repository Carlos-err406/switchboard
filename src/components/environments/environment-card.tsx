import { buttonVariants } from '#/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '#/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import { cn } from '#/lib/utils.ts'
import type { Doc } from '#convex/_generated/dataModel.js'
import { Link } from '@tanstack/react-router'
import { ExternalLink } from 'lucide-react'
import type { ComponentProps, FC, PropsWithChildren } from 'react'
import { DeleteEnvironmentDialog } from './delete-environment-dialog'
import { RenameEnvironmentDialog } from './rename-environment-dialog'

export const EnvironmentCard: FC<{ environment: Doc<'environments'> }> = ({
  environment,
}) => {
  return (
    <Card key={environment._id}>
      <CardHeader className="flex items-center justify-between">
        <GoToEnvironment
          environment={environment}
          className="w-fit"
          tooltipSide="right"
        >
          {environment.name}
        </GoToEnvironment>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {/* <Badge variant={'outline'}>
            {environment.environmentsCount} environment(s)
          </Badge>
          <Badge variant={'outline'}>{environment.flagsCount} flags(s)</Badge>
          <Badge variant={'outline'}>
            {environment.membersCount} member(s)
          </Badge> */}
        </div>
      </CardContent>

      <CardFooter className="justify-end">
        <GoToEnvironment
          environment={environment}
          tooltipSide="bottom"
          className={buttonVariants({ variant: 'secondary' })}
        >
          <ExternalLink />
        </GoToEnvironment>
        <RenameEnvironmentDialog environment={environment} />
        <DeleteEnvironmentDialog environment={environment} />
      </CardFooter>
    </Card>
  )
}

const GoToEnvironment: FC<
  {
    environment: Doc<'environments'>
    className?: string
    tooltipSide?: ComponentProps<typeof TooltipContent>['side']
  } & PropsWithChildren
> = ({ environment, children, className, tooltipSide }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          to="/projects/$projectId"
          params={{ projectId: environment.projectId }}
          search={{ environment: environment._id }}
          className={cn(className)}
        >
          {children}
        </Link>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide}>Go to environment</TooltipContent>
    </Tooltip>
  )
}
