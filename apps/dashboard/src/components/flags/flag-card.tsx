import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@switchboard/ui/components/card";

import { Badge } from "@switchboard/ui/components/badge";
import type { Doc } from "@convex/_generated/dataModel.js";
import type { FC } from "react";
import { DeleteFlagDialog } from "./delete-flag-dialog";
import { FlagToggle } from "./flag-toggle";
import { UpdateFlagDialog } from "./update-flag-dialog";
import { Flag } from "lucide-react";
import { payloadType } from "@switchboard/common";

export const FlagCard: FC<{ flag: Doc<"flags"> }> = ({ flag }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center w-full justify-between">
          <CardTitle className="flex items-center gap-2">
            <Flag className="size-4" /> {flag.key}
          </CardTitle>
          <FlagToggle flag={flag} />
        </div>
        <CardDescription>{flag.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 gap-2 flex flex-col">
        <div className="w-full flex bg-muted p-1.5 mt-auto">
          <pre>{flag.payload?.toString() ?? "undefined"}</pre>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={"outline"}>type: {payloadType(flag.payload)}</Badge>
        </div>
      </CardContent>

      <CardFooter className="justify-end">
        <UpdateFlagDialog flag={flag} />
        <DeleteFlagDialog flag={flag} />
      </CardFooter>
    </Card>
  );
};
