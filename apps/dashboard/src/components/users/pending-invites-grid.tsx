import { Badge } from "@switchboard/ui/components/badge";
import { Button } from "@switchboard/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@switchboard/ui/components/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@switchboard/ui/components/tooltip";
import { toastMutationError } from "#/lib/utils.ts";
import { api } from "@convex/_generated/api.js";
import type { Doc } from "@convex/_generated/dataModel.js";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useQuery } from "convex/react";
import { Mail, RefreshCw, Trash2 } from "lucide-react";
import type { FC } from "react";
import { PERMISSION_LABELS } from "./utils";

dayjs.extend(relativeTime);

const InviteCard: FC<{ invite: Doc<"invites"> }> = ({ invite }) => {
  const expired = dayjs().isAfter(dayjs(invite.expiresAt));

  const resendFn = useConvexMutation(
    api.invites.mutations.resendInviteMutation,
  );
  const { mutate: resend, isPending: isResending } = useMutation({
    mutationFn: resendFn,
    onError: toastMutationError,
  });

  const revokeFn = useConvexMutation(
    api.invites.mutations.revokeInviteMutation,
  );
  const { mutate: revoke, isPending: isRevoking } = useMutation({
    mutationFn: revokeFn,
    onError: toastMutationError,
  });

  return (
    <Card className={expired ? "opacity-60" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="size-4" /> {invite.toEmail}
          {expired ? (
            <Badge variant="destructive" className="ml-auto">
              Expired
            </Badge>
          ) : (
            <Badge variant="secondary" className="ml-auto">
              Pending
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Invited by {invite.createdByEmail} ·{" "}
          {dayjs(invite._creationTime).format("MMM DD, YYYY")}
          {expired
            ? ` · Expired ${dayjs(invite.expiresAt).fromNow()}`
            : ` · Expires ${dayjs(invite.expiresAt).fromNow()}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {invite.permissions.map((permission) => (
            <Badge key={permission} variant="outline">
              {PERMISSION_LABELS[permission]}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              disabled={isResending}
              onClick={() => resend({ id: invite._id })}
            >
              <RefreshCw className={isResending ? "animate-spin" : ""} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Resend invite</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              disabled={isRevoking}
              onClick={() => revoke({ id: invite._id })}
            >
              <Trash2 />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Revoke invite</TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  );
};

export const PendingInvitesGrid: FC = () => {
  const invites = useQuery(api.invites.queries.getPendingInvitesQuery);

  if (!invites?.length) return null;

  return (
    <div className="space-y-4">
      <h2>Pending Invites</h2>
      <div className="gap-3 w-full auto-grid [--min-col-size:250px]">
        {invites.map((invite) => (
          <InviteCard key={invite._id} invite={invite} />
        ))}
      </div>
    </div>
  );
};
