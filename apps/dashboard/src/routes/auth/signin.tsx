import { SignInForm } from "#/integrations/convex/auth/signin-form.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/signin")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SignInForm />;
}
