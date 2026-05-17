import { api } from '#convex/_generated/api.js';
import { convexQuery } from '@convex-dev/react-query';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import type { FC } from 'react';
import { EmptyProjectsGrid } from './empty-projects-list';
import { ProjectCard } from './project-card';

export const ProjectsGrid: FC = () => {
  const { data } = useQuery({
    ...convexQuery(api.models.projects.getUserProjects),
  })
  if (data && data.length === 0) {
    return <EmptyProjectsGrid />
  }
  return (
    <div className="grid grid-cols-6 gap-3 w-full">
      {data?.map((project) => (
        <Link
          to="/projects/$projectId"
          params={{ projectId: project._id }}
          key={project._id}
        >
          <ProjectCard project={project} />
        </Link>
      ))}
    </div>
  )
}
