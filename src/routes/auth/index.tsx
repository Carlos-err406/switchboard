import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/')({
  component: RouteComponent,
  beforeLoad: () => {
    redirect({ to: '/auth/signin' })
  },
})

function RouteComponent() {
  return null
}
