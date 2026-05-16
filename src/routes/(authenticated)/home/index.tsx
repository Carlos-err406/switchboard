import { api } from '#convex/_generated/api'
import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)/home/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useSuspenseQuery(convexQuery(api.flags.getUserFlags))

  return (
    <table>
      <thead>
        <th>Name</th>
        <th>Value</th>
        <th>Description</th>
      </thead>
      <tbody>
        {data?.map((flag) => (
          <tr>
            <td>{flag.name}</td>
            <td>{flag.value}</td>
            <td>{flag.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
