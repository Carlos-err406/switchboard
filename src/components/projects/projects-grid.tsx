import { api } from '#convex/_generated/api.js'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import type { FC } from 'react'
import { CreateProjectCard } from './create-project-card'
import { ProjectCard } from './project-card'

export const ProjectsGrid: FC = () => {
  const search = useSearch({ from: '__root__' })
  const { data } = useQuery({
    ...convexQuery(api.projects.queries.getProjectsQuery, { ...search }),
  })

  return (
    <div className="gap-3 w-full auto-grid [--min-col-size:250px]">
      <CreateProjectCard />
      {data?.map((project) => (
        <ProjectCard project={project} key={project._id} />
      ))}
    </div>
  )
}
