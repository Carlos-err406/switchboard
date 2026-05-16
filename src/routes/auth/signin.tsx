import { SignIn } from '@clerk/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/signin')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SignIn
      signInUrl="/auth/signin"
      signUpUrl="/auth/signup"
      forceRedirectUrl="/home"
    />
  )
}
