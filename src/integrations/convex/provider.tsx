import { ConvexAuthProvider } from '@convex-dev/auth/react'
import { useRouteContext } from '@tanstack/react-router'

export default function AppConvexProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { convexQueryClient } = useRouteContext({ from: '__root__' })

  return (
    <ConvexAuthProvider client={convexQueryClient.convexClient}>
      {children}
    </ConvexAuthProvider>
  )
}
