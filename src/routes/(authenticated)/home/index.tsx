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
    <table className="w-full text-sm text-left">
      <thead className="border-b text-muted-foreground">
        <tr>
          <th className="py-2 px-3 font-medium">Name</th>
          <th className="py-2 px-3 font-medium">Value</th>
          <th className="py-2 px-3 font-medium">Description</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((flag) => (
          <tr key={flag._id} className="border-b last:border-0">
            <td className="py-2 px-3">{flag.name}</td>
            <td className="py-2 px-3 font-mono">{String(flag.value)}</td>
            <td className="py-2 px-3 text-muted-foreground">{flag.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
