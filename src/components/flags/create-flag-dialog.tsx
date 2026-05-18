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
import { toastMutationError } from '#/lib/utils.ts'
import { api } from '#convex/_generated/api.js'
import type { Id } from '#convex/_generated/dataModel.js'
import { useConvexMutation } from '@convex-dev/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { FlagTriangleRight } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const createFlagSchema = z.object({
  flagKey: z.string().min(3, 'Must have at least 3 characters'),
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
type CreateFlagInputs = z.infer<typeof createFlagSchema>

export const CreateFlagDialog: FC<{
  projectId: Id<'projects'>
  environmentId: Id<'environments'>
}> = ({ projectId, environmentId }) => {
  const [open, setOpen] = useState(false)

  const mutationFn = useConvexMutation(api.models.flags.createFlagMutation)
  const { mutate: createFlag, isPending } = useMutation({
    mutationFn,
    onError: toastMutationError,
    onSuccess: () => setOpen(false),
  })

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateFlagInputs>({
    defaultValues: { flagKey: '', flagValue: null },
    resolver: zodResolver(createFlagSchema),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ variant: 'default' })}>
        <FlagTriangleRight /> Create Flag
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Flag creation</DialogTitle>
          <DialogDescription>
            Create a feature flag for the current environment. Values are
            inferred to null, boolean, number or "string"
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((data) =>
            createFlag({
              key: data.flagKey,
              value: data.flagValue,
              projectId,
              environmentId,
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
            <Button type="submit" disabled={isPending} className="ml-auto">
              Submit
            </Button>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  )
}
