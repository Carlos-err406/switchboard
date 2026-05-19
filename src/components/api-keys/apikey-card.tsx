import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '#/components/ui/card';
import type { DetailedApiKey } from '#/lib/types/inferred.ts';
import dayjs from 'dayjs';
import type { FC } from 'react';
import { Badge } from '../ui/badge';
import { ApiKeyToggle } from './apikey-toggle';
import { DeleteApiKeyDialog } from './delete-apikey-dialog';
import { UpdateApiKeyDialog } from './update-apikey-dialog';

export const ApiKeyCard: FC<{ apiKey: DetailedApiKey }> = ({ apiKey }) => {
  const formatExpiresAt = () => {
    const { expiresAt } = apiKey
    if (!expiresAt) return 'Never'
    const expires = dayjs(expiresAt)
    if (expires.isBefore(dayjs())) return 'Expired'
    return expires.fromNow() // e.g. "in 3 days"
  }

  const formatLastUsed = () => {
    const { lastUsedAt } = apiKey
    if (!lastUsedAt) return 'Never'
    return dayjs(lastUsedAt).fromNow() // e.g. "2 days ago"
  }
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center w-full justify-between">
          <CardTitle>{apiKey.name}</CardTitle>
          <ApiKeyToggle apiKey={apiKey} />
        </div>
        <CardDescription>{apiKey.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 gap-2 flex flex-col">
        <div className="flex flex-wrap gap-2">
          <Badge variant={'outline'}>Expires: {formatExpiresAt()}</Badge>
          <Badge variant={'outline'}>Last used: {formatLastUsed()}</Badge>
          <Badge variant={'outline'}>Created by: {apiKey.creatorEmail}</Badge>
        </div>
      </CardContent>

      <CardFooter className="justify-end">
        <UpdateApiKeyDialog apiKey={apiKey} />
        <DeleteApiKeyDialog apiKey={apiKey} />
      </CardFooter>
    </Card>
  )
}
