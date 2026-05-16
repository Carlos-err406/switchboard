import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/(authenticated)/home')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Outlet />
    </div>
  )
}
