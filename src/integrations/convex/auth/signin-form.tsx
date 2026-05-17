import { Button } from '#/components/ui/button.tsx';
import { Input } from '#/components/ui/input.tsx';
import { useAuthActions } from '@convex-dev/auth/react';
import { useRouter } from '@tanstack/react-router';

export function SignInForm() {
  const { signIn } = useAuthActions()
  const router = useRouter()
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        void signIn('password', formData).then(() => {
          router.navigate({ to: '/home' })
        })
      }}
    >
      <Input name="email" placeholder="Email" type="text" />
      <Input name="password" placeholder="Password" type="password" />
      <Button type="submit">Sign in</Button>
    </form>
  )
}
