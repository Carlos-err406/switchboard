import { buttonVariants } from "@switchboard/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@switchboard/ui/components/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@switchboard/ui/components/tooltip";
import { useCurrentUser } from "#/hooks/use-current-user.ts";
import { useHasProjectPermissions } from "#/hooks/use-has-permission.ts";
import type { Doc } from "@convex/_generated/dataModel.js";
import { Shield } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";
import { UpdateMemberPermissionsForm } from "./update-member-permissions-form";

type MemberWithUser = Doc<"projectUsers"> & { email: string };

export const UpdateMemberPermissionsDialog: FC<{
  member: MemberWithUser;
}> = ({ member }) => {
  const [open, setOpen] = useState(false);
  const currentUser = useCurrentUser();
  const isSelf = currentUser?._id === member.userId;
  const canEdit =
    useHasProjectPermissions(["member.update"], member.projectId) && !isSelf;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger
            className={buttonVariants({ variant: "secondary" })}
            disabled={!canEdit}
          >
            <Shield />
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">Update permissions</TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update member permissions</DialogTitle>
          <DialogDescription>
            Update project permissions for {member.email}.
          </DialogDescription>
        </DialogHeader>
        <UpdateMemberPermissionsForm
          member={member}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
