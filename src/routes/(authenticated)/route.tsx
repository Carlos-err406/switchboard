import HeaderUser from '#/integrations/clerk/header-user.tsx'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <HeaderUser />
      <Outlet />
    </div>
  )
}
