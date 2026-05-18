import { Button, buttonVariants } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { Field, FieldError, FieldLabel, FieldSet } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import { toastMutationError } from '#/lib/utils.ts'
import { api } from '#convex/_generated/api.js'
import type { Doc } from '#convex/_generated/dataModel.js'
import { useConvexMutation } from '@convex-dev/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const renameEnvironmentSchema = z.object({
  environmentName: z.string().min(3, 'Must have at least 3 characters'),
})
type RenameEnvironmentInputs = z.infer<typeof renameEnvironmentSchema>

export const RenameEnvironmentDialog: FC<{
  environment: Doc<'environments'>
}> = ({ environment }) => {
  const [open, setOpen] = useState(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<RenameEnvironmentInputs>({
    defaultValues: { environmentName: environment.name },
    resolver: zodResolver(renameEnvironmentSchema),
  })

  const mutationFn = useConvexMutation(
    api.environments.mutations.renameEnvironmentMutation,
  )
  const { mutate: renameEnvironment, isPending } = useMutation({
    mutationFn,
    onError: toastMutationError,
    onSuccess: () => {
      setOpen(false)
      reset()
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger className={buttonVariants({ variant: 'secondary' })}>
            <Pencil />
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">Rename environment</TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename environment</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((data) =>
            renameEnvironment({
              environmentId: environment._id,
              projectId: environment.projectId,
              name: data.environmentName,
            }),
          )}
        >
          <FieldSet>
            <Field>
              <FieldLabel htmlFor="environmentName">
                Environment Name (new)
              </FieldLabel>
              <Input
                id="environmentName"
                {...register('environmentName')}
                placeholder="Acme environment"
              />
              {errors.environmentName?.message && (
                <FieldError>{errors.environmentName.message}</FieldError>
              )}
            </Field>
            <Button type="submit" disabled={isPending} className="ml-auto">
              Submit
            </Button>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  )
}
