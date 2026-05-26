import { useConvexAuth } from "@convex-dev/auth/react";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/auth/signin" />;

  return <Outlet />;
}
