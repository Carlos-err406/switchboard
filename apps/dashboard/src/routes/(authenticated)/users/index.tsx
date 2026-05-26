import { InviteUserDialog } from "#/components/users/invite-user-dialog.tsx";
import { PendingInvitesGrid } from "#/components/users/pending-invites-grid.tsx";
import { UsersGrid } from "#/components/users/users-grid.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/users/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex w-full justify-between items-center">
          <h1>Users</h1>
          <InviteUserDialog />
        </div>
        <UsersGrid />
      </div>
      <PendingInvitesGrid />
    </div>
  );
}
