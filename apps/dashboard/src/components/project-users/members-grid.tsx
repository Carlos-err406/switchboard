import { api } from "@convex/_generated/api.js";
import type { Id } from "@convex/_generated/dataModel.js";
import { useQuery } from "convex/react";
import type { FC } from "react";
import { MemberCard } from "./member-card";

export const MembersGrid: FC<{ projectId: Id<"projects"> }> = ({
  projectId,
}) => {
  const members = useQuery(api.project_users.queries.getProjectMembersQuery, {
    projectId,
  });

  return (
    <div className="gap-3 w-full auto-grid [--min-col-size:380px]">
      {members?.map((member) => (
        <MemberCard key={member._id} member={member} />
      ))}
    </div>
  );
};
