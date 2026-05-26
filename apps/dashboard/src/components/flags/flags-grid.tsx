import { api } from "@convex/_generated/api.js";
import type { Id } from "@convex/_generated/dataModel.js";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import type { FC } from "react";
import { CreateFlagDialog } from "./create-flag-dialog";
import { EmptyFlags } from "./empty-flags";
import { FlagCard } from "./flag-card";

export const FlagsGrid: FC<{
  environmentId: Id<"environments">;
}> = ({ environmentId }) => {
  const search = useSearch({ from: "__root__" });
  const { data: flags } = useQuery({
    ...convexQuery(api.flags.queries.getFlagsQuery, {
      q: search.q,
      environmentId,
    }),
  });

  if (flags?.length === 0) return <EmptyFlags environmentId={environmentId} />;

  return (
    <div className="gap-3 w-full auto-grid [--min-col-size:250px]">
      {flags?.map((flag) => (
        <FlagCard flag={flag} key={flag._id} />
      ))}
    </div>
  );
};
