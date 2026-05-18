import { Card, CardContent, CardFooter, CardHeader } from '#/components/ui/card'

import type { Doc } from '#convex/_generated/dataModel.js'
import type { FC } from 'react'
import { Badge } from '#/components/ui/badge'
import { DeleteFlagDialog } from './delete-flag-dialog'
import { FlagToggle } from './flag-toggle'
import { UpdateFlagDialog } from './update-flag-dialog'

export const FlagCard: FC<{ flag: Doc<'flags'> }> = ({ flag }) => {
  return (
    <Card key={flag._id} className="shadow-md">
      <CardHeader className="flex items-center w-full justify-between">
        <span>{flag.key}</span>
        <FlagToggle flag={flag} />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {flag.description && (
            <p className="text-muted-foreground">{flag.description}</p>
          )}
          <div className="w-full flex bg-muted p-1">
            <pre>{flag.value?.toString() ?? 'null'}</pre>
          </div>
          <Badge variant={'outline'}>
            type: {flag.value ? typeof flag.value : 'null '}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="justify-end">
        <UpdateFlagDialog flag={flag} />
        <DeleteFlagDialog flag={flag} />
      </CardFooter>
    </Card>
  )
}
