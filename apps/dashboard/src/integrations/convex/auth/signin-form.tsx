import { Button } from '@switchboard/ui/components/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@switchboard/ui/components/field'
import { Input } from '@switchboard/ui/components/input'
import { useAuthActions } from '@convex-dev/auth/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'

const signInSchema = z.object({
  email: z.email({ error: 'Not a valid email' }),
  password: z.string(),
})
type SignInInputs = z.infer<typeof signInSchema>

export function SignInForm() {
  const { signIn } = useAuthActions()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInputs>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit: SubmitHandler<SignInInputs> = async (data) => {
    await signIn('password', data)
    navigate({ to: '/projects' })
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <FieldSet className="w-full min-w-xs max-w-xs">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input {...register('email')} type="text" placeholder="Email" />
            {errors.email?.message && (
              <FieldError>{errors.email.message}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              {...register('password')}
              type="password"
              placeholder="******"
            />
          </Field>
          {errors.password?.message && (
            <FieldError>{errors.password.message}</FieldError>
          )}
        </FieldGroup>
        <Button type="submit" className="ml-auto">
          Sign in
        </Button>
      </FieldSet>
    </form>
  )
}
