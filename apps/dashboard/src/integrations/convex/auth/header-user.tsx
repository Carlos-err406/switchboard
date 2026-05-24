import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@switchboard/ui/components/avatar'
import { Button } from '@switchboard/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@switchboard/ui/components/dropdown-menu'
import { ChangePasswordDialog } from '#/components/users/change-password-dialog'
import { api } from '@convex/_generated/api.js'
import { useAuthActions } from '@convex-dev/auth/react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useQuery,
} from 'convex/react'
import { Asterisk, DoorOpen } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'

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
  const user = useQuery(api.users.queries.currentUserQuery)
  const { signOut } = useAuthActions()
  const navigate = useNavigate()
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  if (!user) return null
  const fallback = user.email.slice(0, 2)
  return (
    <>
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
        <DropdownMenuContent className="w-52">
          <DropdownMenuLabel className="text-muted-foreground text-sm text-center">
            {user.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setChangePasswordOpen(true)}>
              <Asterisk /> Change password
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => signOut().then(() => navigate({ to: '/' }))}
            >
              <DoorOpen /> Log out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ChangePasswordDialog
        userId={user._id}
        requireOldPassword
        open={changePasswordOpen}
        setOpen={setChangePasswordOpen}
      />
    </>
  )
}
