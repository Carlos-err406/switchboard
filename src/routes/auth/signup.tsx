import { SignUp } from '@clerk/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SignUp
      signInUrl={window.location.origin + '/auth/signin'}
      forceRedirectUrl={window.location.origin + '/home'}
    />
  )
}
