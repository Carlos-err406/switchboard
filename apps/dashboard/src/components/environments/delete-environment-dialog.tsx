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
import { api } from "@convex/_generated/api.js";
import type { Doc } from "@convex/_generated/dataModel.js";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";

export const DeleteEnvironmentDialog: FC<{
  environment: Doc<"environments">;
}> = ({ environment }) => {
  const [open, setOpen] = useState(false);
  const mutationFn = useConvexMutation(
    api.environments.mutations.deleteEnvironmentMutation,
  );
  const { mutate: deleteEnvironment, isPending } = useMutation({
    mutationFn,
    onError: toastMutationError,
    onSuccess: () => setOpen(false),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger className={buttonVariants({ variant: "destructive" })}>
            <Trash2 />
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">Delete environment</TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete environment</DialogTitle>
          <DialogDescription className="prose">
            Are you sure you want to delete this environment? All{" "}
            <strong>flags</strong> and <strong>api keys</strong> will be
            deleted.
            <br />
            <strong className="text-destructive">
              This action is irreversible.
            </strong>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() =>
              deleteEnvironment({
                environmentId: environment._id,
              })
            }
            variant={"destructive"}
            disabled={isPending}
            className="ml-auto"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
