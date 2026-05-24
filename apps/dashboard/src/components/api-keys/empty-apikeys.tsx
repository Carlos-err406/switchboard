import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@switchboard/ui/components/empty'
import type { Id } from '@convex/_generated/dataModel.js'
import { Key } from 'lucide-react'
import type { FC } from 'react'
import { CreateApiKeyDialog } from './create-apikey-dialog'

export const EmptyApiKeys: FC<{ environmentId: Id<'environments'> }> = ({
  environmentId,
}) => (
  <Empty>
    <EmptyMedia>
      <Key />
    </EmptyMedia>
    <EmptyHeader>
      <EmptyTitle>No api keys yet</EmptyTitle>
      <EmptyDescription>
        Create an api key to query this environment's feature flags securely.
      </EmptyDescription>
    </EmptyHeader>
    <CreateApiKeyDialog environmentId={environmentId} />
  </Empty>
)
