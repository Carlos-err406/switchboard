import { ProjectCard } from '#/components/projects/project-card.tsx'
import { api } from '#convex/_generated/api.js'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)/projects/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useQuery({
    ...convexQuery(api.models.projects.getUserProjects),
  })

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
