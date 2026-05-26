import { Button } from "@switchboard/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@switchboard/ui/components/tooltip";
import { useCurrentUser } from "#/hooks/use-current-user.ts";
import { toastMutationError } from "#/lib/utils.ts";
import { api } from "@convex/_generated/api.js";
import type { Doc } from "@convex/_generated/dataModel.js";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { Lock, Unlock } from "lucide-react";
import type { FC } from "react";

export const LockUserButton: FC<{ user: Doc<"users"> }> = ({ user }) => {
  const currentUser = useCurrentUser();
  const isSelf = currentUser?._id === user._id;
  const mutationFn = useConvexMutation(api.users.mutations.updateUserMutation);
  const { mutate: toggleLock, isPending } = useMutation({
    mutationFn,
    onError: toastMutationError,
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="secondary"
          disabled={user.role === "admin" || isSelf || isPending}
          onClick={() => toggleLock({ userId: user._id, locked: !user.locked })}
        >
          {user.locked ? <Unlock /> : <Lock />}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {user.locked ? "Unlock user" : "Lock user"}
      </TooltipContent>
    </Tooltip>
  );
};
