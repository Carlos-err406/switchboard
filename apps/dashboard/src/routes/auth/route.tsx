import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex items-center justify-center h-[calc(100svh-theme(size.16))] w-full">
      <Outlet />
    </div>
  )
}
