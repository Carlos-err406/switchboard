import type { Id } from '#convex/_generated/dataModel.js'
import { Flag } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'
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
import { CreateFlagForm } from './create-flag-form'

export const CreateFlagCard: FC<{
  environmentId: Id<'environments'>
}> = ({ environmentId }) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Card className="ring-0 border border-dashed size-full">
          <CardHeader className="my-auto">
            <CardTitle className="flex items-center gap-2 justify-center">
              <Flag /> <span>Create Flag</span>
            </CardTitle>
            <CardDescription>
              Create a feature flag for the current environment. Values are
              inferred to null, boolean, number or "string"
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
        <CreateFlagForm
          environmentId={environmentId}
          onSuccess={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  )
}
