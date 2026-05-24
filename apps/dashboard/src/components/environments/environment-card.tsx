import { buttonVariants } from '@switchboard/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@switchboard/ui/components/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@switchboard/ui/components/tooltip'
import type { EnvironmentSummary } from '#/lib/types/inferred.ts'
import { cn } from '#/lib/utils.ts'
import { useNavigate } from '@tanstack/react-router'
import { ExternalLink, Stone } from 'lucide-react'
import type { ComponentProps, FC, PropsWithChildren } from 'react'
import { DeleteEnvironmentDialog } from './delete-environment-dialog'
import { UpdateEnvironmentDialog } from './update-environment-dialog'
import { Badge } from '@switchboard/ui/components/badge'

export const EnvironmentCard: FC<{
  environment: EnvironmentSummary
  active?: boolean
}> = ({ environment, active }) => {
  return (
    <Card>
      <CardHeader>
        <GoToEnvironment
          environment={environment}
          className="w-fit"
          tooltipSide="right"
        >
          <CardTitle className="flex items-center gap-2">
            <Stone className="size-4" /> {environment.name} {active && '*'}
          </CardTitle>
        </GoToEnvironment>
        <CardDescription>{environment.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex h-full items-end">
        <div className="flex flex-wrap gap-2">
          <Badge variant={'outline'}>{environment.flagsCount} flag(s)</Badge>
          <Badge variant={'outline'}>
            {environment.apiKeysCount} api key(s)
          </Badge>
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
        <UpdateEnvironmentDialog environment={environment} />
        <DeleteEnvironmentDialog environment={environment} />
      </CardFooter>
    </Card>
  )
}

const GoToEnvironment: FC<
  {
    environment: EnvironmentSummary
    className?: string
    tooltipSide?: ComponentProps<typeof TooltipContent>['side']
  } & PropsWithChildren
> = ({ environment, children, className, tooltipSide }) => {
  const navigate = useNavigate()
  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(className)}
        onClick={() =>
          navigate({
            to: '/projects/$projectId',
            params: { projectId: environment.projectId },
            search: { environment: environment._id, tab: 'flags' },
          })
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent side={tooltipSide}>Go to environment</TooltipContent>
    </Tooltip>
  )
}
