import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)/projects/$projectId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { projectId } = Route.useParams()
  return <div>Hello `/(authenticated)/projects/{projectId}/`!</div>
}
