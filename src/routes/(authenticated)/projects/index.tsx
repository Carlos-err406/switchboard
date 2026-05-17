import { ProjectCard } from '#/components/projects/project-card.tsx'
import { Button } from '#/components/ui/button.tsx'
import { toastMutationError } from '#/lib/utils.ts'
import { api } from '#convex/_generated/api.js'
import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)/projects/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading } = useQuery({
    ...convexQuery(api.models.projects.getUserProjects),
  })
  const mutationFn = useConvexMutation(api.models.projects.createProject)
  const { mutate: createProject, isPending } = useMutation({
    mutationFn,
    onError: toastMutationError,
  })

  if (isLoading || !data || data.length === 0) {
    return (
      <Button
        disabled={isPending}
        onClick={async () => createProject({ name: 'ASD' })}
      >
        Create project
      </Button>
    )
  }
  return (
    <div className="grid grid-cols-6 gap-3 w-full">
      {data.map((project) => (
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
