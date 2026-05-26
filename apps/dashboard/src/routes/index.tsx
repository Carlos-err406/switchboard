import { useConvexAuth } from "@convex-dev/auth/react";
import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: RootRedirect });

function RootRedirect() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (isLoading) return null;

  return isAuthenticated ? (
    <Navigate to="/projects" />
  ) : (
    <Navigate to="/auth/signin" />
  );
}
