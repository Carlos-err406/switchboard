import { Button } from "@switchboard/ui/components/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@switchboard/ui/components/field";
import { Input } from "@switchboard/ui/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { api } from "@convex/_generated/api";

const forgotSchema = z.object({
  email: z.email({ error: "Not a valid email" }),
});
type ForgotInputs = z.infer<typeof forgotSchema>;

export const Route = createFileRoute("/auth/reset-password/")({
  validateSearch: z.object({ email: z.string().optional() }).parse,
  component: ForgotPassword,
});

function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const search = Route.useSearch();
  const createResetToken = useMutation(
    api.password_resets.mutations.createPasswordResetTokenMutation,
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotInputs>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: search.email },
  });

  const onSubmit: SubmitHandler<ForgotInputs> = async (data) => {
    await createResetToken({ email: data.email });
    setSent(true);
  };

  if (sent) {
    return (
      <div className="w-full min-w-xs max-w-xs space-y-4 text-center">
        <h2 className="text-lg font-medium">Check your email</h2>
        <p className="text-sm text-muted-foreground">
          If an account exists with that email, we sent a password reset link.
          It expires in 10 minutes.
        </p>
        <Link to="/auth/signin" className="text-sm">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <FieldSet className="w-full min-w-xs max-w-xs">
        <h2 className="text-lg font-medium">Forgot password</h2>
        <p className="text-sm text-muted-foreground">
          Enter your email and we'll send you a reset link.
        </p>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              autoFocus
            />
            <FieldError>{errors.email?.message}</FieldError>
          </Field>
        </FieldGroup>
        <div className="flex items-center justify-between">
          <Link to="/auth/signin" className="text-sm text-muted-foreground">
            Back to sign in
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send reset link"}
          </Button>
        </div>
      </FieldSet>
    </form>
  );
}
