import { Button } from '#/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { api } from '#convex/_generated/api.js'
import { useAuthActions } from '@convex-dev/auth/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'

export const Route = createFileRoute('/invite/$token/')({
  component: RouteComponent,
})

const acceptInviteSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    error: 'Passwords do not match',
  })
type AcceptInviteInputs = z.infer<typeof acceptInviteSchema>

function RouteComponent() {
  const { token } = Route.useParams()
  const invite = useQuery(api.invites.queries.getInviteByTokenQuery, { token })
  const { signIn } = useAuthActions()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AcceptInviteInputs>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  if (!invite) return null

  const onSubmit = async (data: AcceptInviteInputs) => {
    try {
      await signIn('password', {
        email: invite.toEmail,
        password: data.password,
        inviteToken: token,
      })
      navigate({ to: '/projects' })
    } catch {
      setError('root', {
        type: 'server',
        message: 'Failed to accept invitation. Please try again.',
      })
    }
  }

  return (
    <div className="flex items-center justify-center h-[calc(100svh-theme(size.16))] w-full">
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <FieldSet className="w-full min-w-xs max-w-xs">
          <div className="space-y-1">
            <h1 className="text-lg font-semibold">Accept Invitation</h1>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {invite.createdByEmail}
              </span>{' '}
              invited you to join Switchboard.
            </p>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="invite-email">Email</FieldLabel>
              <Input
                id="invite-email"
                type="email"
                value={invite.toEmail}
                disabled
              />
            </Field>
            <Field required>
              <FieldLabel htmlFor="invite-password">Password</FieldLabel>
              <Input
                id="invite-password"
                type="password"
                placeholder="Choose a password"
                {...register('password')}
              />
              <FieldError>{errors.password?.message}</FieldError>
            </Field>
            <Field required>
              <FieldLabel htmlFor="invite-confirm-password">
                Confirm password
              </FieldLabel>
              <Input
                id="invite-confirm-password"
                type="password"
                placeholder="Confirm your password"
                {...register('confirmPassword')}
              />
              <FieldError>{errors.confirmPassword?.message}</FieldError>
            </Field>
          </FieldGroup>

          {errors.root?.message && (
            <FieldError>{errors.root.message}</FieldError>
          )}

          <Button type="submit" disabled={isSubmitting} className="ml-auto">
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>
        </FieldSet>
      </form>
    </div>
  )
}
