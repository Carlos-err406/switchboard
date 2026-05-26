import { api } from "@convex/_generated/api.js";
import { useSearch } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import type { FC } from "react";
import { UserCard } from "./user-card";

export const UsersGrid: FC = () => {
  const search = useSearch({ from: "__root__" });
  const data = useQuery(api.projects.queries.getUsersQuery, { q: search.q });

  return (
    <div className="gap-3 w-full auto-grid [--min-col-size:250px]">
      {data?.map((user) => (
        <UserCard user={user} key={user._id} />
      ))}
    </div>
  );
};
