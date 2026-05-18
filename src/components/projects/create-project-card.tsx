import { Folder } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '#/components/ui/popover'
import { CreateProjectForm } from './create-project-form'

export const CreateProjectCard: FC = () => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Card className="ring-0 border border-dashed size-full">
          <CardHeader className="my-auto">
            <CardTitle className="flex items-center gap-2 justify-center">
              <Folder /> <span>Create Project</span>
            </CardTitle>
            <CardDescription>
              Use projects to group flags, users and api keys
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
        <CreateProjectForm onSuccess={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  )
}
