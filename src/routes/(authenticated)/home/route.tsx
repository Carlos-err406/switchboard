import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { api } from '#convex/_generated/api'

export const Route = createFileRoute('/(authenticated)/home')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useSuspenseQuery(convexQuery(api.flags.getUserFlags, {}))

  return (
    <div>
      <Outlet />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
