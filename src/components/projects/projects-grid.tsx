import { api } from '#convex/_generated/api.js'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import type { FC } from 'react'
import { EmptyProjectsGrid } from './empty-projects-list'
import { ProjectCard } from './project-card'

export const ProjectsGrid: FC = () => {
  const search = useSearch({ from: '__root__' })
  const { data } = useQuery({
    ...convexQuery(api.models.projects.getProjectsQuery, { ...search }),
  })
  if (data && data.length === 0) {
    return <EmptyProjectsGrid />
  }
  return (
    <div className="grid grid-cols-6 gap-3 w-full">
      {data?.map((project) => (
        <ProjectCard project={project} key={project._id} />
      ))}
    </div>
  )
}
