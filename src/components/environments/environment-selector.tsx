import { buttonVariants } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import type { DetailedProject } from '#/lib/types/inferred.ts'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Stone } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'
import { CreateEnvironmentDialog } from './create-environment-dialog'

export const EnvironmentSelector: FC<{
  project: DetailedProject
}> = ({ project }) => {
  const [openCreateEnvironment, setOpenCreateEnvironment] = useState(false)
  const { environment } = useSearch({
    from: '/(authenticated)/projects/$projectId/',
  })
  const search = useSearch({ from: '/(authenticated)/projects/$projectId/' })
  const active =
    project.environments.find((e) => e._id == environment) ??
    project.environments[0]

  const navigate = useNavigate()
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className={buttonVariants({ variant: 'outline' })}>
          Environment: <Stone /> {active.name}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {project.environments.map((e) => (
            <DropdownMenuItem
              key={`env-selector-${e._id}`}
              onClick={() =>
                navigate({ to: '.', search: { ...search, environment: e._id } })
              }
              className="flex items-center gap-2"
            >
              <span>{active._id == e._id && '*'}</span>
              <span>{e.name}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator></DropdownMenuSeparator>
          <DropdownMenuItem onClick={() => setOpenCreateEnvironment(true)}>
            <Stone />
            Create environment
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateEnvironmentDialog
        projectId={project._id}
        open={openCreateEnvironment}
        setOpen={setOpenCreateEnvironment}
      />
    </>
  )
}
