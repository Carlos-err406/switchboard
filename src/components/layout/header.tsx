import { HeaderUser } from '#/integrations/convex/auth/header-user.tsx'
import { Link } from '@tanstack/react-router'
import { Authenticated } from 'convex/react'
import { ExternalLink } from 'lucide-react'
import type { FC } from 'react'

export const Header: FC = () => {
  return (
    <div className="flex items-center justify-between h-16 px-4">
      <Link to="/">Open Flagger</Link>
      <div className="flex items-center gap-4">
        <Authenticated>
          <Link to="/projects" className="flex items-center gap-2">
            <span>Projects</span> <ExternalLink size={16} />
          </Link>
        </Authenticated>
        <HeaderUser />
      </div>
    </div>
  )
}
