import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '#/components/ui/empty'
import type { Id } from '#convex/_generated/dataModel.js'
import { FlagOff } from 'lucide-react'
import type { FC } from 'react'
import { CreateFlagDialog } from './create-flag-dialog'

export const EmptyFlags: FC<{
  projectId: Id<'projects'>
  environmentId: Id<'environments'>
}> = ({ projectId, environmentId }) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FlagOff />
        </EmptyMedia>
        <EmptyTitle>No Flags Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any flags in this environment yet. Get
          started by creating your first flag.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center">
        <CreateFlagDialog projectId={projectId} environmentId={environmentId} />
      </EmptyContent>
    </Empty>
  )
}
