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
import type { Id } from "@convex/_generated/dataModel.js";
import { Asterisk } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";
import { ChangePasswordForm } from "./change-password-form";

type Props = {
  userId: Id<"users">;
  requireOldPassword?: boolean;
  disabled?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

export const ChangePasswordDialog: FC<Props> = ({
  userId,
  requireOldPassword,
  disabled,
  open: controlledOpen,
  setOpen: controlledSetOpen,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledSetOpen ?? setInternalOpen;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {controlledOpen === undefined && (
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger
              className={buttonVariants({ variant: "secondary" })}
              disabled={disabled}
            >
              <Asterisk />
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Change password</TooltipContent>
        </Tooltip>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>
            {requireOldPassword
              ? "Enter your current password and choose a new one."
              : "Set a new password for this user."}
          </DialogDescription>
        </DialogHeader>
        <ChangePasswordForm
          userId={userId}
          requireOldPassword={requireOldPassword}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
