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
import type { DetailedEnvironment } from '#/lib/types/inferred.ts'
import { cn } from '#/lib/utils.ts'
import { useNavigate } from '@tanstack/react-router'
import { ExternalLink } from 'lucide-react'
import type { ComponentProps, FC, PropsWithChildren } from 'react'
import { DeleteEnvironmentDialog } from './delete-environment-dialog'
import { UpdateEnvironmentDialog } from './update-environment-dialog'
import { Badge } from '../ui/badge'

export const EnvironmentCard: FC<{
  environment: DetailedEnvironment
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
          <CardTitle>
            {active && '*'} {environment.name}
          </CardTitle>
        </GoToEnvironment>
        <CardDescription>{environment.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex h-full items-end">
        <div className="flex flex-wrap gap-2">
          <Badge variant={'outline'}>{environment.flags.length} flag(s)</Badge>
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
    environment: DetailedEnvironment
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
