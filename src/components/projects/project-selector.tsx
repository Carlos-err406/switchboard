import { buttonVariants } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import type { Doc } from '#convex/_generated/dataModel.js'
import { useNavigate } from '@tanstack/react-router'
import { Folder } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'
import { CreateProjectDialog } from './create-project-dialog'
import { useQuery } from 'convex/react'
import { api } from '#convex/_generated/api.js'

export const ProjectSelector: FC<{
  activeProject: Doc<'projects'>
}> = ({ activeProject }) => {
  const projects = useQuery(api.projects.queries.getProjectsQuery, {}) ?? []
  const [openCreateProject, setOpenCreateProject] = useState(false)
  const navigate = useNavigate()
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className={buttonVariants({ variant: 'outline' })}>
          <Folder /> {activeProject.name}
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
              <span>{activeProject._id == p._id && '*'}</span>
              <span>{p.name}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator></DropdownMenuSeparator>
          <DropdownMenuItem
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
