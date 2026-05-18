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
import { Stone } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const createEnvironmentSchema = z.object({
  environmentName: z.string().min(3, 'Must have at least 3 characters'),
})
type CreateEnvironmentInputs = z.infer<typeof createEnvironmentSchema>

export const CreateEnvironmentDialog: FC<{
  projectId: Id<'projects'>
}> = ({ projectId }) => {
  const [open, setOpen] = useState(false)

  const mutationFn = useConvexMutation(
    api.models.environments.createEnvironmentMutation,
  )
  const { mutate: createEnvironment, isPending } = useMutation({
    mutationFn,
    onError: toastMutationError,
    onSuccess: () => setOpen(false),
  })

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateEnvironmentInputs>({
    defaultValues: { environmentName: '' },
    resolver: zodResolver(createEnvironmentSchema),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ variant: 'default' })}>
        <Stone /> Create Environment
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Environment creation</DialogTitle>
          <DialogDescription>
            Use environments to group flags, usual names are{' '}
            <strong>Production</strong> or <strong>Staging</strong>
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((data) =>
            createEnvironment({ name: data.environmentName, projectId }),
          )}
        >
          <FieldSet>
            <Field>
              <FieldLabel htmlFor="environmentName">
                Environment Name
              </FieldLabel>
              <Input
                id="environmentName"
                {...register('environmentName')}
                placeholder="Production"
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
