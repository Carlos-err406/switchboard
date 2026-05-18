import { Button, buttonVariants } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

const updateFlagSchema = z.object({
  flagKey: z.string().min(3, 'Must have at least 3 characters'),
  flagDescription: z.string().optional(),
  flagValue: z
    .union([z.string(), z.number(), z.boolean(), z.null()])
    .transform((arg) =>
      arg === 'null'
        ? null
        : arg === 'true'
          ? true
          : arg === 'false'
            ? false
            : isNaN(Number(arg))
              ? arg
              : Number(arg),
    ),
})
type UpdateFlagInputs = z.infer<typeof updateFlagSchema>

export const UpdateFlagDialog: FC<{ flag: Doc<'flags'> }> = ({ flag }) => {
  const [open, setOpen] = useState(false)
  const mutationFn = useConvexMutation(api.flags.mutations.updateFlagMutation)
  const { mutate: updateFlag, isPending } = useMutation({
    mutationFn,
    onError: toastMutationError,
    onSuccess: () => setOpen(false),
  })

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<UpdateFlagInputs>({
    defaultValues: { flagKey: flag.key, flagValue: flag.value },
    resolver: zodResolver(updateFlagSchema),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger className={buttonVariants({ variant: 'secondary' })}>
            <Pencil />
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">Update flag</TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update flag</DialogTitle>
          <DialogDescription>
            Update a feature flag for the current environment. Values are
            inferred to null, boolean, number or "string"
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((data) =>
            updateFlag({
              key: data.flagKey,
              value: data.flagValue,
              description: data.flagDescription,
              environmentId: flag.environmentId,
              projectId: flag.projectId,
              flagId: flag._id,
            }),
          )}
        >
          <FieldSet>
            <Field>
              <FieldLabel htmlFor="flagName">Flag Key</FieldLabel>
              <Input
                id="flagKey"
                {...register('flagKey')}
                placeholder="logs.enable"
              />
              {errors.flagKey?.message && (
                <FieldError>{errors.flagKey.message}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="flagValue">Flag Value</FieldLabel>
              <Input
                id="flagValue"
                {...register('flagValue')}
                placeholder="ON / OFF / null / true / 99 / hello world"
              />
              {errors.flagValue?.message && (
                <FieldError>{errors.flagValue.message}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="flagValue">Flag Description</FieldLabel>
              <Input
                id="flagDescription"
                {...register('flagDescription')}
                placeholder="Enables client-side logging"
              />
              {errors.flagDescription?.message && (
                <FieldError>{errors.flagDescription.message}</FieldError>
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
