import { CreateEnvironmentDialog } from '#/components/environments/create-environment-dialog.tsx'
import { EnvironmentSelector } from '#/components/environments/environment-selector.tsx'
import { api } from '#convex/_generated/api.js'
import type { Id } from '#convex/_generated/dataModel.js'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useSearch } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)/projects/$projectId/')({
  params: {
    parse: ({ projectId }) => ({
      projectId: projectId as Id<'projects'>,
    }),
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { projectId } = Route.useParams()
  const { data: project, isLoading } = useQuery({
    ...convexQuery(api.models.projects.getProjectQuery, { projectId }),
  })
  const { environment } = useSearch({
    from: '/(authenticated)/projects/$projectId/',
  })

  if (isLoading) return 'loading...'

  if (!project || project.environments.length == 0)
    return 'no envs create empty state'

  const activeEnvironment =
    project.environments.find((e) => e._id == environment) ??
    project.environments[0]

  return (
    <div>
      <div className="flex items-center w-full justify-between">
        <div className="flex items-center gap-4">
          <h2>Project {project.name}</h2>
          <EnvironmentSelector project={project} />
        </div>
        <CreateEnvironmentDialog projectId={project._id} />
      </div>
      <pre>{JSON.stringify(activeEnvironment.flags, null, 2)}</pre>
    </div>
  )
}
