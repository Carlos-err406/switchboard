import { Badge } from '@switchboard/ui/components/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@switchboard/ui/components/card'
import { SeparatorContent } from '@switchboard/ui/components/separator'
import { api } from '@convex/_generated/api.js'
import type { Doc } from '@convex/_generated/dataModel.js'
import dayjs from 'dayjs'
import { useQuery } from 'convex/react'
import { Asterisk, User } from 'lucide-react'
import type { FC } from 'react'
import { ChangePasswordDialog } from './change-password-dialog'
import { DeleteUserDialog } from './delete-user-dialog'
import { LockUserButton } from './lock-user-button'
import { UpdatePermissionsDialog } from './update-permissions-dialog'
import { PERMISSION_LABELS } from './utils'

export const UserCard: FC<{ user: Doc<'users'> }> = ({ user }) => {
  const currentUser = useQuery(api.users.queries.currentUserQuery)
  const isSelf = currentUser?._id === user._id
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="size-4" /> {user.email}
          {isSelf && <Asterisk className="size-4" />}
          <Badge
            className="ml-auto"
            variant={user.role === 'admin' ? 'default' : 'secondary'}
          >
            {user.role}
          </Badge>
        </CardTitle>
        <CardDescription>
          {user.email} · {dayjs(user._creationTime).format('MMM DD, YYYY')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <SeparatorContent>Permissions</SeparatorContent>
          <div className="flex flex-wrap gap-2">
            {user.permissions.map((permission) => (
              <Badge key={permission} variant="outline">
                {PERMISSION_LABELS[permission]}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-end">
        <LockUserButton user={user} />
        <ChangePasswordDialog
          userId={user._id}
          requireOldPassword={isSelf}
          disabled={!isSelf && user.role === 'admin'}
        />
        <UpdatePermissionsDialog user={user} />
        <DeleteUserDialog user={user} />
      </CardFooter>
    </Card>
  )
}
