import { api } from '#convex/_generated/api.js'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { useParams, useSearch } from '@tanstack/react-router'
import type { FC } from 'react'
import { CreateEnvironmentCard } from './create-environment-card'
import { EnvironmentCard } from './environment-card'
import type { Id } from '#convex/_generated/dataModel.js'

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

  return (
    <div className="auto-grid [--min-col-width:250px] gap-3 w-full">
      <CreateEnvironmentCard projectId={params.projectId} />
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
