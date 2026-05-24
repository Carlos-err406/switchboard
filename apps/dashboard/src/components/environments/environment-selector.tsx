import { buttonVariants } from '@switchboard/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@switchboard/ui/components/dropdown-menu'
import type { DetailedProject } from '#/lib/types/inferred.ts'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Asterisk, ChevronDown, Stone } from 'lucide-react'
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
          <ChevronDown className="in-data-[state=open]:rotate-180 transition-transform" />
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
              {active._id == e._id && <Asterisk className="size-3" />}
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
