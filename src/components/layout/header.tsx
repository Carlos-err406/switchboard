import { HeaderUser } from '#/integrations/convex/auth/header-user.tsx'
import { Link } from '@tanstack/react-router'
import { Authenticated } from 'convex/react'
import type { FC } from 'react'
import { SearchInput } from './search-input'

export const Header: FC = () => {
  return (
    <div className="flex items-center justify-between h-16 px-4">
      <Link to="/">Switchboard</Link>
      <div className="flex items-center gap-4">
        <Authenticated>
          <SearchInput />
          <Link to="/projects">Projects</Link>
          <Link to="/users">Users</Link>
        </Authenticated>
        <HeaderUser />
      </div>
    </div>
  )
}
