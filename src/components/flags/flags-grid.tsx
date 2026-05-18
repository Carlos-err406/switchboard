import { api } from '#convex/_generated/api.js'
import type { Id } from '#convex/_generated/dataModel.js'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import type { FC } from 'react'
import { CreateFlagCard } from './create-flag-card'
import { FlagCard } from './flag-card'

export const FlagsGrid: FC<{
  projectId: Id<'projects'>
  environmentId: Id<'environments'>
}> = ({ projectId, environmentId }) => {
  const search = useSearch({ from: '__root__' })
  const { data: flags, error } = useQuery({
    ...convexQuery(api.flags.queries.getFlagsQuery, {
      q: search.q,
      projectId,
      environmentId,
    }),
  })
  if (error) {
    return error.message
  }

  return (
    <div className="grid grid-cols-5 gap-3 w-full">
      <CreateFlagCard projectId={projectId} environmentId={environmentId} />
      {flags?.map((flag) => (
        <FlagCard flag={flag} key={flag._id} />
      ))}
    </div>
  )
}
