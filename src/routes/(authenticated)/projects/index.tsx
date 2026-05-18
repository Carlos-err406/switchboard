import { ProjectsGrid } from '#/components/projects/projects-grid.tsx'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)/projects/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-4">
      <div className="flex w-full justify-between items-center">
        <h1>Projects</h1>
      </div>
      <ProjectsGrid />
    </div>
  )
}
