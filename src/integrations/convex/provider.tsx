import { clientEnv } from '#env'
import { useAuth } from '@clerk/react';
import { ConvexQueryClient } from '@convex-dev/react-query';
import { useRouteContext } from '@tanstack/react-router';
import { ConvexProviderWithClerk } from 'convex/react-clerk';

const CONVEX_URL = clientEnv.VITE_CONVEX_URL

export function createConvexQueryClient() {
  return new ConvexQueryClient(CONVEX_URL)
}

export default function AppConvexProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { convexQueryClient } = useRouteContext({ from: '__root__' })

  return (
    <ConvexProviderWithClerk
      client={convexQueryClient.convexClient}
      useAuth={useAuth}
    >
      {children}
    </ConvexProviderWithClerk>
  )
}
