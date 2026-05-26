import { buttonVariants } from "@switchboard/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@switchboard/ui/components/dialog";
import { useHasProjectPermissions } from "#/hooks/use-has-permission.ts";
import type { Id } from "@convex/_generated/dataModel.js";
import { useParams } from "@tanstack/react-router";
import { Flag } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";
import { CreateFlagForm } from "./create-flag-form";

export const CreateFlagDialog: FC<{
  environmentId: Id<"environments">;
}> = ({ environmentId }) => {
  const { projectId } = useParams({ strict: false }) as {
    projectId: Id<"projects">;
  };
  const [open, setOpen] = useState(false);
  const canCreate = useHasProjectPermissions(["flag.create"], projectId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={buttonVariants({ variant: "default" })}
        disabled={!canCreate}
      >
        <Flag /> Create Flag
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Flag creation</DialogTitle>
          <DialogDescription>
            Create a feature flag for the current environment. Values are
            inferred to null, boolean, number or "string"
          </DialogDescription>
        </DialogHeader>
        <CreateFlagForm
          environmentId={environmentId}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
