import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'

import { Badge } from '#/components/ui/badge'
import type { Doc } from '#convex/_generated/dataModel.js'
import type { FC } from 'react'
import { DeleteFlagDialog } from './delete-flag-dialog'
import { FlagToggle } from './flag-toggle'
import { UpdateFlagDialog } from './update-flag-dialog'


export const FlagCard: FC<{ flag: Doc<'flags'> }> = ({ flag }) => {
  const valueType = () => {
    const arg = flag.value
    if (arg == null) return 'null'
    if (arg === true || arg === false) return 'boolean'
    if (/^\d+$/.test(String(arg))) return 'number'
    return 'string'
  }
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center w-full justify-between">
          <CardTitle>{flag.key}</CardTitle>
          <FlagToggle flag={flag} />
        </div>
        <CardDescription>{flag.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 gap-2 flex flex-col">
        <div className="w-full flex bg-muted p-1.5 mt-auto">
          <pre>{flag.value?.toString() ?? 'null'}</pre>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={'outline'}>type: {valueType()}</Badge>
        </div>
      </CardContent>

      <CardFooter className="justify-end">
        <UpdateFlagDialog flag={flag} />
        <DeleteFlagDialog flag={flag} />
      </CardFooter>
    </Card>
  )
}
