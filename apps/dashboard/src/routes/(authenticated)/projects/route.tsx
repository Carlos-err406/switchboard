import { createFileRoute, Outlet } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/(authenticated)/projects")({
  validateSearch: z.object({
    environment: z.string().optional(),
    tab: z.enum(["flags", "environments", "members", "api_keys"]).optional(),
  }).parse,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-4">
      <Outlet />
    </div>
  );
}
