import { buttonVariants } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { useHasPermissions } from '#/hooks/use-has-permission.ts'
import { api } from '#convex/_generated/api.js'
import type { Doc } from '#convex/_generated/dataModel.js'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { Asterisk, ChevronDown, Folder } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'
import { CreateProjectDialog } from './create-project-dialog'

export const ProjectSelector: FC<{
  activeProject: Doc<'projects'>
}> = ({ activeProject }) => {
  const projects = useQuery(api.projects.queries.getProjectsQuery, {}) ?? []
  const canCreateProjects = useHasPermissions(['projects.create'])

  const [openCreateProject, setOpenCreateProject] = useState(false)
  const navigate = useNavigate()
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className={buttonVariants({ variant: 'outline' })}>
          <Folder /> {activeProject.name}
          <ChevronDown className="in-data-[state=open]:rotate-180 transition-transform" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit">
          {projects.map((p) => (
            <DropdownMenuItem
              key={`project-selector-${p._id}`}
              onClick={() =>
                navigate({
                  to: '/projects/$projectId',
                  params: { projectId: p._id },
                })
              }
              className="flex items-center gap-2"
            >
              {activeProject._id == p._id && <Asterisk className="size-3" />}
              <span>{p.name}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator></DropdownMenuSeparator>
          <DropdownMenuItem
            disabled={!canCreateProjects}
            onClick={() => setOpenCreateProject(true)}
            className="text-nowrap"
          >
            <Folder />
            Create Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateProjectDialog
        open={openCreateProject}
        setOpen={setOpenCreateProject}
      />
    </>
  )
}
