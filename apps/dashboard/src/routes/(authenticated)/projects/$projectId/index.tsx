import { ApiKeysGrid } from '#/components/api-keys/apikeys-grid.tsx'
import { CreateApiKeyDialog } from '#/components/api-keys/create-apikey-dialog.tsx'
import { CreateEnvironmentDialog } from '#/components/environments/create-environment-dialog.tsx'
import { EnvironmentSelector } from '#/components/environments/environment-selector.tsx'
import { EnvironmentsGrid } from '#/components/environments/environments-grid.tsx'
import { CreateFlagDialog } from '#/components/flags/create-flag-dialog.tsx'
import { FlagsGrid } from '#/components/flags/flags-grid.tsx'
import { ProjectSelector } from '#/components/projects/project-selector.tsx'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@switchboard/ui/components/tabs'
import { api } from '@convex/_generated/api.js'
import type { Id } from '@convex/_generated/dataModel.js'
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
              <Users2 /> Members
            </TabsTrigger>
            <TabsTrigger value="api_keys">
              <Key /> Api keys
            </TabsTrigger>
          </TabsList>
        </div>
      </div>
      <TabsContent value="flags">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <EnvironmentSelector project={project} />
            <CreateFlagDialog environmentId={activeEnvironment._id} />
          </div>
          <FlagsGrid environmentId={activeEnvironment._id} />
        </div>
      </TabsContent>
      <TabsContent value="environments">
        <div className="space-y-4">
          <CreateEnvironmentDialog projectId={project._id} />
          <EnvironmentsGrid active={activeEnvironment._id} />
        </div>
      </TabsContent>
      <TabsContent value="members">
        {/* <UsersGrid project={project} /> */}
      </TabsContent>
      <TabsContent value="api_keys">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <EnvironmentSelector project={project} />
            <CreateApiKeyDialog environmentId={activeEnvironment._id} />
          </div>
          <ApiKeysGrid environmentId={activeEnvironment._id} />
        </div>
      </TabsContent>
    </Tabs>
  )
}
