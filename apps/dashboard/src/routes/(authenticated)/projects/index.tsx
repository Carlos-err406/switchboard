import { CreateProjectDialog } from '#/components/projects/create-project-dialog.tsx'
import { ProjectsGrid } from '#/components/projects/projects-grid.tsx'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)/projects/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-4">
      <h1>Projects</h1>
      <CreateProjectDialog />
      <ProjectsGrid />
    </div>
  )
}
