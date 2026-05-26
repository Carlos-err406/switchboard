import { Badge } from "@switchboard/ui/components/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@switchboard/ui/components/card";
import { SeparatorContent } from "@switchboard/ui/components/separator";
import type { Doc } from "@convex/_generated/dataModel.js";
import { Crown, User } from "lucide-react";
import type { FC } from "react";
import { RemoveMemberDialog } from "./remove-member-dialog";
import { UpdateMemberPermissionsDialog } from "./update-member-permissions-dialog";
import { PROJECT_PERMISSION_LABELS } from "./utils";

type MemberWithUser = Doc<"projectUsers"> & {
  email: string;
  role: string;
  isOwner: boolean;
};

export const MemberCard: FC<{ member: MemberWithUser }> = ({ member }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {member.isOwner ? (
            <Crown className="size-4" />
          ) : (
            <User className="size-4" />
          )}
          {member.email}
          {member.isOwner && <Badge className="ml-auto">Owner</Badge>}
          {!member.isOwner && (
            <Badge
              className="ml-auto"
              variant={member.role === "admin" ? "default" : "secondary"}
            >
              {member.role}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <SeparatorContent>Permissions</SeparatorContent>
          <div className="flex flex-wrap gap-2">
            {member.permissions.map((permission) => (
              <Badge key={permission} variant="outline">
                {PROJECT_PERMISSION_LABELS[permission]}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      {!member.isOwner && (
        <CardFooter className="justify-end">
          <UpdateMemberPermissionsDialog member={member} />
          <RemoveMemberDialog member={member} />
        </CardFooter>
      )}
    </Card>
  );
};
