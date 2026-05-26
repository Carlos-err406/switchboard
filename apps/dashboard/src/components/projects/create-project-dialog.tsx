import { buttonVariants } from "@switchboard/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@switchboard/ui/components/dialog";
import { useHasPermissions } from "#/hooks/use-has-permission.ts";
import { useNavigate } from "@tanstack/react-router";
import { Folder } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";
import { CreateProjectForm } from "./create-project-form";

type Props = {
  open?: boolean;
  setOpen?: (open: boolean) => void;
};
export const CreateProjectDialog: FC<Props> = ({
  open: controlledOpen,
  setOpen: controlledSetOpen,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledSetOpen ?? setInternalOpen;
  const navigate = useNavigate();
  const canCreateProjects = useHasPermissions(["projects.create"]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {controlledOpen === undefined && (
        <DialogTrigger
          className={buttonVariants({ variant: "default" })}
          disabled={!canCreateProjects}
        >
          <Folder /> Create Project
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Project creation</DialogTitle>
          <DialogDescription>
            Use projects to group flags, users and api keys
          </DialogDescription>
        </DialogHeader>
        <CreateProjectForm
          onSuccess={(projectId) => {
            setOpen(false);
            navigate({ to: "/projects/$projectId", params: { projectId } });
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
