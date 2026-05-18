import { EnvironmentSelector } from '#/components/environments/environment-selector.tsx'
import { EnvironmentsGrid } from '#/components/environments/environments-grid.tsx'
import { FlagsGrid } from '#/components/flags/flags-grid.tsx'
import { ProjectSelector } from '#/components/projects/project-selector.tsx'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '#/components/ui/tabs.tsx'
import { api } from '#convex/_generated/api.js'
import type { Id } from '#convex/_generated/dataModel.js'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useSearch } from '@tanstack/react-router'
import { Flag, Key, Stone, Users2 } from 'lucide-react'

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
    ...convexQuery(api.projects.queries.getProjectQuery, { projectId }),
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
    <Tabs defaultValue="flags" className="space-y-4">
      <div className="flex items-center w-full justify-between">
        <div className="flex items-center gap-4">
          <ProjectSelector activeProject={project} />
          <TabsList>
            <TabsTrigger value="flags">
              <Flag /> Flags
            </TabsTrigger>
            <TabsTrigger value="environments">
              <Stone /> Environments
            </TabsTrigger>
            <TabsTrigger value="members">
              <Users2 /> Project members
            </TabsTrigger>
            <TabsTrigger value="api_keys">
              <Key /> Api keys
            </TabsTrigger>
          </TabsList>
        </div>
      </div>
      <TabsContent value="flags">
        <div className="space-y-4">
          <EnvironmentSelector project={project} />
          <FlagsGrid
            environmentId={activeEnvironment._id}
            projectId={activeEnvironment.projectId}
          />
        </div>
      </TabsContent>
      <TabsContent value="environments">
        <EnvironmentsGrid />
      </TabsContent>
    </Tabs>
  )
}
