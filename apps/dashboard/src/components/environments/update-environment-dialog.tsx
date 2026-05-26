import { buttonVariants } from "@switchboard/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@switchboard/ui/components/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@switchboard/ui/components/tooltip";
import type { Doc } from "@convex/_generated/dataModel.js";
import { Pencil } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";
import { UpdateEnvironmentForm } from "./update-environment-form";

export const UpdateEnvironmentDialog: FC<{
  environment: Doc<"environments">;
}> = ({ environment }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger className={buttonVariants({ variant: "secondary" })}>
            <Pencil />
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">Rename environment</TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename environment</DialogTitle>
        </DialogHeader>
        <UpdateEnvironmentForm
          environment={environment}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
