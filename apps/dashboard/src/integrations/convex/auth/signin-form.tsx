import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@switchboard/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@switchboard/ui/components/field";
import { Input } from "@switchboard/ui/components/input";
import { Link, useNavigate } from "@tanstack/react-router";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

const signInSchema = z.object({
  email: z.email({ error: "Not a valid email" }),
  password: z.string(),
});
type SignInInputs = z.infer<typeof signInSchema>;

export function SignInForm() {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignInInputs>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });
  const email = watch("email");

  const onSubmit: SubmitHandler<SignInInputs> = async (data) => {
    try {
      await signIn("password", data);
      navigate({ to: "/projects" });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      if (
        message.includes("Invalid credentials") ||
        message.includes("InvalidSecret")
      ) {
        toast.error("Invalid email or password");
      } else if (message.includes("locked")) {
        toast.error("Your account has been locked. Contact an administrator.");
      } else if (
        message.includes("Too many") ||
        message.includes("TooManyFailedAttempts")
      ) {
        toast.error("Too many failed attempts. Please try again later.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <FieldSet className="w-full min-w-xs max-w-xs">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input {...register("email")} type="text" placeholder="Email" />
            <FieldError>{errors.email?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              {...register("password")}
              type="password"
              placeholder="******"
            />
            <FieldDescription>
              <Link to="/auth/reset-password" search={{ email }}>
                Forgot password?
              </Link>
            </FieldDescription>
            <FieldError>{errors.password?.message}</FieldError>
          </Field>
        </FieldGroup>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </FieldSet>
    </form>
  );
}
