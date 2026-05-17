import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { api } from '#convex/_generated/api.js'
import { useAuthActions } from '@convex-dev/auth/react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useQuery,
} from 'convex/react'
import type { FC } from 'react'

export const HeaderUser: FC = () => {
  return (
    <>
      <AuthLoading>
        <span className="opacity-50">Sign in</span>
      </AuthLoading>
      <Authenticated>
        <AvatarDropdown />
      </Authenticated>
      <Unauthenticated>
        <Link to="/auth/signin">Sign in</Link>
      </Unauthenticated>
    </>
  )
}

export function AvatarDropdown() {
  const user = useQuery(api.models.users.currentUser)
  const { signOut } = useAuthActions()
  const navigate = useNavigate()
  if (!user) return null
  const fallback = user.email.slice(0, 2)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Avatar size="lg">
            <AvatarImage
              src={`https://robohash.org/${user.email}?set=set3`}
              alt={user.email}
            />
            <AvatarFallback className="uppercase">{fallback}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuLabel className="text-muted-foreground text-sm text-center">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup> 
        <DropdownMenuSeparator />*/}
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => signOut().then(() => navigate({ to: '/' }))}
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
