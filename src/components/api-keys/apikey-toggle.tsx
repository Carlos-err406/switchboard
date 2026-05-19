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

export const ApiKeyToggle: FC<{ apiKey: Doc<'apiKeys'> }> = ({ apiKey }) => {
  const mutationFn = useConvexMutation(
    api.api_keys.mutations.updateApiKeyMutation,
  )
  const { mutate: updateApiKey, isPending } = useMutation({
    mutationFn,
    onError: toastMutationError,
  })

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <Switch
            disabled={isPending}
            checked={apiKey.enabled}
            onCheckedChange={(checked) =>
              updateApiKey({
                apiKeyId: apiKey._id,
                enabled: checked,
              })
            }
          />
        </div>
      </TooltipTrigger>

      <TooltipContent>
        {apiKey.enabled ? 'Disable' : 'Enable'} apiKey
      </TooltipContent>
    </Tooltip>
  )
}
