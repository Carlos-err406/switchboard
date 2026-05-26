import { buttonVariants } from "@switchboard/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@switchboard/ui/components/dialog";
import type { Id } from "@convex/_generated/dataModel.js";
import { useNavigate } from "@tanstack/react-router";
import { Stone } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";
import { CreateEnvironmentForm } from "./create-environment-form";

type Props = {
  projectId: Id<"projects">;
  open?: boolean;
  setOpen?: (open: boolean) => void;
};
export const CreateEnvironmentDialog: FC<Props> = ({
  projectId,
  open: controlledOpen,
  setOpen: controlledSetOpen,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledSetOpen ?? setInternalOpen;
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {controlledOpen === undefined && (
        <DialogTrigger className={buttonVariants({ variant: "default" })}>
          <Stone /> Create Environment
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new environment</DialogTitle>
          <DialogDescription>
            Use environments to group flags, usual names are{" "}
            <strong>Production</strong> or <strong>Staging</strong>
          </DialogDescription>
        </DialogHeader>
        <CreateEnvironmentForm
          projectId={projectId}
          onSuccess={(environmentId) => {
            setOpen(false);
            navigate({ to: ".", search: { environment: environmentId } });
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
