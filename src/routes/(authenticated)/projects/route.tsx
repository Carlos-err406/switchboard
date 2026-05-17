import { CreateProjectButton } from '#/components/projects/create-project-btn.tsx'
import { CreateProjectDialog } from '#/components/projects/create-project-dialog.tsx';
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)/projects')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <CreateProjectDialog />
      <Outlet />
    </div>
  )
}
