import { clientEnv } from '#env'
import { ClerkProvider } from '@clerk/react'

const PUBLISHABLE_KEY = clientEnv.VITE_CLERK_PUBLISHABLE_KEY

export default function AppClerkProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      {children}
    </ClerkProvider>
  )
}
