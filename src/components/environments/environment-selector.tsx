import type { DetailedProject } from '#/lib/types/inferred.ts'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Stone } from 'lucide-react'
import type { FC } from 'react'
import { buttonVariants } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

export const EnvironmentSelector: FC<{
  project: DetailedProject
}> = ({ project }) => {
  const { environment } = useSearch({
    from: '/(authenticated)/projects/$projectId/',
  })
  const active =
    project.environments.find((e) => e._id == environment) ??
    project.environments[0]

  const navigate = useNavigate()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={buttonVariants({ variant: 'outline' })}>
        Environment: <Stone /> {active.name}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {project.environments.map((e) => (
          <DropdownMenuItem
            key={`env-selector-${e._id}`}
            onClick={() =>
              navigate({ to: '.', search: { environment: e._id } })
            }
            className="flex items-center gap-2"
          >
            <span>{active._id == e._id && '*'}</span>
            <span>{e.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
