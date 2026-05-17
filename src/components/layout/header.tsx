import { HeaderUser } from '#/integrations/convex/auth/header-user.tsx'
import { Link } from '@tanstack/react-router'
import { Authenticated } from 'convex/react'
import type { FC } from 'react'

export const Header: FC = () => {
  return (
    <div className="flex items-center justify-between h-16 px-4">
      <Link to="/">Open Flagger</Link>
      <div className="flex items-center gap-4">
        <Authenticated>
          <Link to="/home">Home</Link>
        </Authenticated>
        <HeaderUser />
      </div>
    </div>
  )
}
