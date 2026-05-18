import { api } from '#convex/_generated/api.js'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { useParams, useSearch } from '@tanstack/react-router'
import type { FC } from 'react'
import { CreateEnvironmentCard } from './create-environment-card'
import { EnvironmentCard } from './environment-card'

export const EnvironmentsGrid: FC = () => {
  const search = useSearch({ from: '__root__' })
  const params = useParams({ from: '/(authenticated)/projects/$projectId/' })
  const { data } = useQuery({
    ...convexQuery(api.environments.queries.getEnvironmentsQuery, {
      projectId: params.projectId,
      q: search.q,
    }),
  })

  return (
    <div className="grid grid-cols-6 gap-3 w-full">
      <CreateEnvironmentCard projectId={params.projectId} />
      {data?.map((environment) => (
        <EnvironmentCard environment={environment} key={environment._id} />
      ))}
    </div>
  )
}
