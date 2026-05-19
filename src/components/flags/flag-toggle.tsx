import { Switch } from '#/components/ui/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import { toastMutationError } from '#/lib/utils.ts'
import { api } from '#convex/_generated/api.js'
import type { Doc } from '#convex/_generated/dataModel.js'
import { useConvexMutation } from '@convex-dev/react-query'
import { useMutation } from '@tanstack/react-query'
import type { FC } from 'react'

export const FlagToggle: FC<{ flag: Doc<'flags'> }> = ({ flag }) => {
  const mutationFn = useConvexMutation(api.flags.mutations.updateFlagMutation)
  const { mutate: updateFlag, isPending } = useMutation({
    mutationFn,
    onError: toastMutationError,
  })

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <Switch
            disabled={isPending}
            checked={flag.enabled}
            onCheckedChange={(checked) =>
              updateFlag({
                flagId: flag._id,
                enabled: checked,
              })
            }
          />
        </div>
      </TooltipTrigger>

      <TooltipContent>
        {flag.enabled ? 'Disable' : 'Enable'} flag
      </TooltipContent>
    </Tooltip>
  )
}
