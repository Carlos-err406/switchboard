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
import { useHasProjectPermissions } from "#/hooks/use-has-permission.ts";
import type { Doc } from "@convex/_generated/dataModel.js";
import { Pencil } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";
import { UpdateApiKeyForm } from "./update-apikey-form";

export const UpdateApiKeyDialog: FC<{ apiKey: Doc<"apiKeys"> }> = ({
  apiKey,
}) => {
  const canUpdate = useHasProjectPermissions(
    ["api_key.update"],
    apiKey.projectId,
  );
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger
            disabled={!canUpdate}
            className={buttonVariants({ variant: "secondary" })}
          >
            <Pencil />
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">Update Api key</TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Api key</DialogTitle>
          <DialogDescription>
            Update the api key for the current environment.
          </DialogDescription>
        </DialogHeader>
        <UpdateApiKeyForm apiKey={apiKey} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
