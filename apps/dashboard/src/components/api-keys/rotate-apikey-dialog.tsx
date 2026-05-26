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
import { useHasProjectPermissions } from "#/hooks/use-has-permission.ts";
import { toastMutationError } from "#/lib/utils.ts";
import { api } from "@convex/_generated/api.js";
import type { Doc } from "@convex/_generated/dataModel.js";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import type { FunctionReturnType } from "convex/server";
import { RotateCcwKey } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";
import { CopyApiKeyDialog } from "./copy-apikey-dialog";

export const RotateApiKeyDialog: FC<{ apiKey: Doc<"apiKeys"> }> = ({
  apiKey,
}) => {
  const canRotate = useHasProjectPermissions(
    ["api_key.delete"],
    apiKey.projectId,
  );
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<FunctionReturnType<
    typeof api.api_keys.mutations.rotateApiKeyMutation
  > | null>(null);

  const mutationFn = useConvexMutation(
    api.api_keys.mutations.rotateApiKeyMutation,
  );
  const { mutate: rotateApiKey, isPending } = useMutation({
    mutationFn,
    onError: toastMutationError,
    onSuccess: (data) => {
      setOpen(false);
      setTimeout(() => setResult(data), 150);
    },
  });

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger
              disabled={!canRotate}
              className={buttonVariants({ variant: "secondary" })}
            >
              <RotateCcwKey />
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Rotate Api key</TooltipContent>
        </Tooltip>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rotate Api key</DialogTitle>
            <DialogDescription className="prose">
              This will generate a new secret for <strong>{apiKey.name}</strong>
              . The current key will stop working immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() => rotateApiKey({ apiKeyId: apiKey._id })}
            >
              {isPending ? "Rotating..." : "Rotate key"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CopyApiKeyDialog
        title="Key rotated"
        value={result}
        onClose={() => setResult(null)}
      />
    </>
  );
};
