import { Button, buttonVariants } from "@switchboard/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@switchboard/ui/components/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@switchboard/ui/components/tooltip";
import { toastMutationError } from "#/lib/utils.ts";
import { useCurrentUser } from "#/hooks/use-current-user.ts";
import { useHasProjectPermissions } from "#/hooks/use-has-permission.ts";
import { api } from "@convex/_generated/api.js";
import type { Doc } from "@convex/_generated/dataModel.js";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";

type MemberWithUser = Doc<"projectUsers"> & { email: string };

export const RemoveMemberDialog: FC<{ member: MemberWithUser }> = ({
  member,
}) => {
  const [open, setOpen] = useState(false);
  const currentUser = useCurrentUser();
  const isSelf = currentUser?._id === member.userId;
  const canRemove =
    useHasProjectPermissions(["member.remove"], member.projectId) && !isSelf;

  const mutationFn = useConvexMutation(
    api.project_users.mutations.removeProjectMemberMutation,
  );
  const { mutate: removeMember, isPending } = useMutation({
    mutationFn,
    onError: toastMutationError,
    onSuccess: () => setOpen(false),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger
            className={buttonVariants({ variant: "destructive" })}
            disabled={!canRemove}
          >
            <Trash2 />
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">Remove member</TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove member</DialogTitle>
          <DialogDescription>
            Remove {member.email} from this project? They will lose access to
            all flags and environments.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => removeMember({ id: member._id })}
            variant="destructive"
            disabled={isPending}
            className="ml-auto"
          >
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
