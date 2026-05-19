import { ApiKeysGrid } from '#/components/api-keys/apikeys-grid.tsx'
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
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
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
  const search = Route.useSearch()
  const { environment } = search
  const navigate = useNavigate()
  const project = useQuery(api.projects.queries.getProjectQuery, { projectId })

  if (!project) return null

  const activeEnvironment =
    project.environments.find((e) => e._id == environment) ??
    project.environments[0]

  const activeTab = search.tab ?? 'flags'

  return (
    <Tabs
      value={activeTab}
      onValueChange={(tab) =>
        navigate({
          to: '.',
          search: { ...search, tab: tab as typeof search.tab },
        })
      }
      className="space-y-4"
    >
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
          <FlagsGrid environmentId={activeEnvironment._id} />
        </div>
      </TabsContent>
      <TabsContent value="environments">
        <EnvironmentsGrid active={activeEnvironment._id}/>
      </TabsContent>
      <TabsContent value="api_keys">
        <div className="space-y-4">
          <EnvironmentSelector project={project} />
          <ApiKeysGrid environmentId={activeEnvironment._id} />
        </div>
      </TabsContent>
    </Tabs>
  )
}
