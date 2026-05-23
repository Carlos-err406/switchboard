import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '#/components/ui/empty'
import type { Id } from '#convex/_generated/dataModel.js'
import { Flag } from 'lucide-react'
import type { FC } from 'react'
import { CreateFlagDialog } from './create-flag-dialog'

export const EmptyFlags: FC<{ environmentId: Id<'environments'> }> = ({
  environmentId,
}) => (
  <Empty>
    <EmptyMedia>
      <Flag />
    </EmptyMedia>
    <EmptyHeader>
      <EmptyTitle>No flags yet</EmptyTitle>
      <EmptyDescription>
        Create a feature flag to control behavior in this environment.
      </EmptyDescription>
    </EmptyHeader>
    <CreateFlagDialog environmentId={environmentId} />
  </Empty>
)
