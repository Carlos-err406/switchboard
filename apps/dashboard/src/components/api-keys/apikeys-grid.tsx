import { api } from "@convex/_generated/api.js";
import type { Id } from "@convex/_generated/dataModel.js";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import type { FC } from "react";
import { ApiKeyCard } from "./apikey-card";
import { EmptyApiKeys } from "./empty-apikeys";

export const ApiKeysGrid: FC<{
  environmentId: Id<"environments">;
}> = ({ environmentId }) => {
  const search = useSearch({ from: "__root__" });
  const { data: apiKeys } = useQuery({
    ...convexQuery(api.api_keys.queries.getApiKeysQuery, {
      q: search.q,
      environmentId,
    }),
  });

  if (apiKeys?.length === 0)
    return <EmptyApiKeys environmentId={environmentId} />;

  return (
    <div className="gap-3 w-full auto-grid [--min-col-size:250px]">
      {apiKeys?.map((apiKey) => (
        <ApiKeyCard apiKey={apiKey} key={apiKey._id} />
      ))}
    </div>
  );
};
