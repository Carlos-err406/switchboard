import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@switchboard/ui/components/empty";
import type { Id } from "@convex/_generated/dataModel.js";
import { Stone } from "lucide-react";
import type { FC } from "react";
import { CreateEnvironmentDialog } from "./create-environment-dialog";

export const EmptyEnvironments: FC<{ projectId: Id<"projects"> }> = ({
  projectId,
}) => (
  <Empty>
    <EmptyMedia>
      <Stone />
    </EmptyMedia>
    <EmptyHeader>
      <EmptyTitle>No environments yet</EmptyTitle>
      <EmptyDescription>
        Create an environment to organize your flags and api keys.
      </EmptyDescription>
    </EmptyHeader>
    <CreateEnvironmentDialog projectId={projectId} />
  </Empty>
);
