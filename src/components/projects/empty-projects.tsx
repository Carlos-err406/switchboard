import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '#/components/ui/empty'
import { Folder } from 'lucide-react'
import type { FC } from 'react'
import { CreateProjectDialog } from './create-project-dialog'

export const EmptyProjects: FC = () => (
  <Empty>
    <EmptyMedia>
      <Folder />
    </EmptyMedia>
    <EmptyHeader>
      <EmptyTitle>No projects yet</EmptyTitle>
      <EmptyDescription>
        Create your first project to start managing feature flags, environments,
        and api keys.
      </EmptyDescription>
    </EmptyHeader>
    <CreateProjectDialog />
  </Empty>
)
