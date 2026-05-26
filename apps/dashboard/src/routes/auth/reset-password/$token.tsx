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
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAction, useQuery } from "convex/react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";
import { api } from "@convex/_generated/api";
import { QueryErrorState } from "#/components/error-state";

const resetSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type ResetInputs = z.infer<typeof resetSchema>;

export const Route = createFileRoute("/auth/reset-password/$token")({
  component: ResetPassword,
  errorComponent: ({ error }) => <QueryErrorState error={error} />,
});

function ResetPassword() {
  const { token } = Route.useParams();
  const navigate = useNavigate();
  const tokenData = useQuery(
    api.password_resets.queries.getPasswordResetByTokenQuery,
    { token },
  );
  const resetPassword = useAction(
    api.password_resets.actions.resetPasswordWithTokenAction,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetInputs>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  if (tokenData === undefined) {
    return (
      <div className="w-full min-w-xs max-w-xs text-center">
        <p className="text-sm text-muted-foreground">Validating link...</p>
      </div>
    );
  }

  const onSubmit: SubmitHandler<ResetInputs> = async (data) => {
    try {
      await resetPassword({ token, newPassword: data.password });
      toast.success("Password reset successfully");
      navigate({ to: "/auth/signin" });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to reset password",
      );
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <FieldSet className="w-full min-w-xs max-w-xs">
        <h2 className="text-lg font-medium">Set new password</h2>
        <p className="text-sm text-muted-foreground">
          Enter your new password below.
        </p>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="password">New password</FieldLabel>
            <Input
              {...register("password")}
              type="password"
              placeholder="********"
              autoFocus
            />
            {errors.password?.message && (
              <FieldError>{errors.password.message}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
            <Input
              {...register("confirmPassword")}
              type="password"
              placeholder="********"
            />
            {errors.confirmPassword?.message && (
              <FieldError>{errors.confirmPassword.message}</FieldError>
            )}
          </Field>
        </FieldGroup>
        <Button type="submit" className="ml-auto" disabled={isSubmitting}>
          {isSubmitting ? "Resetting..." : "Reset password"}
        </Button>
      </FieldSet>
    </form>
  );
}
