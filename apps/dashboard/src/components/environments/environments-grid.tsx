import { api } from '@convex/_generated/api.js'
import type { Id } from '@convex/_generated/dataModel.js'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { useParams, useSearch } from '@tanstack/react-router'
import type { FC } from 'react'
import { EmptyEnvironments } from './empty-environments'
import { EnvironmentCard } from './environment-card'

export const EnvironmentsGrid: FC<{ active?: Id<'environments'> }> = ({
  active,
}) => {
  const search = useSearch({ from: '__root__' })
  const params = useParams({ from: '/(authenticated)/projects/$projectId/' })
  const { data: environments } = useQuery({
    ...convexQuery(api.environments.queries.getEnvironmentsQuery, {
      projectId: params.projectId,
      q: search.q,
    }),
  })

  if (environments?.length === 0)
    return <EmptyEnvironments projectId={params.projectId} />

  return (
    <div className="auto-grid [--min-col-width:250px] gap-3 w-full">
      {environments?.map((environment) => (
        <EnvironmentCard
          environment={environment}
          key={environment._id}
          active={active === environment._id}
        />
      ))}
    </div>
  )
}
