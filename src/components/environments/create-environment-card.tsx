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
import { Stone } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'
import { CreateEnvironmentForm } from './create-environment-form'

type Props = {
  projectId: Id<'projects'>
}
export const CreateEnvironmentCard: FC<Props> = ({ projectId }) => {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Card className="ring-0 border border-dashed size-full">
          <CardHeader className="my-auto">
            <CardTitle className="flex items-center gap-2 justify-center">
              <Stone /> <span>Create Environment</span>
            </CardTitle>
            <CardDescription>
              Use environments to group flags and api keys
            </CardDescription>
          </CardHeader>
        </Card>
      </PopoverTrigger>
      <PopoverContent
        className="shadow-lg"
        side="right"
        sideOffset={-50}
        alignOffset={-50}
        align="end"
      >
        <CreateEnvironmentForm
          projectId={projectId}
          onSuccess={() => {
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
