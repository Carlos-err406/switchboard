import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import type { Id } from '#convex/_generated/dataModel.js'
import { Key } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'
import { CreateApiKeyForm } from './create-apikey-form'

export const CreateApiKeyCard: FC<{
  environmentId: Id<'environments'>
}> = ({ environmentId }) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Card className="ring-0 border border-dashed size-full">
          <CardHeader className="my-auto">
            <CardTitle className="flex items-center gap-2 justify-center">
              <Key /> <span>Create ApiKey</span>
            </CardTitle>
            <CardDescription>
              Create an Api Key for the current environment. So you can query
              your flags securely
            </CardDescription>
          </CardHeader>
        </Card>
      </PopoverTrigger>
      <PopoverContent
        className="shadow-lg"
        side="right"
        sideOffset={-150}
        alignOffset={-150}
        align="end"
      >
        <CreateApiKeyForm
          environmentId={environmentId}
          onSuccess={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  )
}
