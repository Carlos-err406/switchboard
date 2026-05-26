import { api } from "@convex/_generated/api.js";
import { useQuery } from "convex/react";

export const useCurrentUser = () => {
  return useQuery(api.users.queries.currentUserQuery);
};
