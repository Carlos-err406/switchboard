import { Badge } from '@switchboard/ui/components/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@switchboard/ui/components/card'
import type { Doc } from '@convex/_generated/dataModel.js'
import type { UserPermissionValue } from '@convex/schema/helpers.js'
import dayjs from 'dayjs'
import { User } from 'lucide-react'
import type { FC } from 'react'
import { SeparatorContent } from '@switchboard/ui/components/separator'
import { DeleteUserDialog } from './delete-user-dialog'

const PERMISSION_LABELS: Record<UserPermissionValue, string> = {
  'projects.create': 'Create projects',
  'users.list': 'View users',
  'users.invite': 'Invite users',
  'users.delete': 'Delete users',
}

export const UserCard: FC<{ user: Doc<'users'> }> = ({ user }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="size-4" /> {user.name ?? user.email}
          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
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
        <DeleteUserDialog user={user} />
      </CardFooter>
    </Card>
  )
}
