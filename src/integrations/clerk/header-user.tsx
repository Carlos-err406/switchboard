import { UserButton } from '@clerk/react'
import { Link } from '@tanstack/react-router'
import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react'

export default function HeaderUser() {
  return (
    <>
      <Authenticated>
        <UserButton />
      </Authenticated>
      <Unauthenticated>
        <Link to="/auth/signin">Sign in</Link>
      </Unauthenticated>
      <AuthLoading>
        <Link disabled className="opacity-50" to="/auth/signin">
          Sign in
        </Link>
      </AuthLoading>
    </>
  )
}
