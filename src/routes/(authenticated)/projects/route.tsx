import { CreateProjectDialog } from '#/components/projects/create-project-dialog.tsx'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)/projects')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1>Projects</h1>
        <CreateProjectDialog />
      </div>
      <Outlet />
    </div>
  )
}
