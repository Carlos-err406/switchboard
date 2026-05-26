import { Button } from "@switchboard/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@switchboard/ui/components/field";
import { Input } from "@switchboard/ui/components/input";
import { Switch } from "@switchboard/ui/components/switch";
import { onFormError } from "#/lib/utils.ts";
import { api } from "@convex/_generated/api.js";
import type { UserPermissionValue } from "@convex/schema/helpers.js";
import { USER_PERMISSIONS } from "@convex/schema/helpers.js";
import { useConvexMutation } from "@convex-dev/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { Send } from "lucide-react";
import type { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod/v4";

const PERMISSION_LABELS: Record<UserPermissionValue, string> = {
  "projects.create": "Create projects",
  "users.list": "View users",
  "users.invite": "Invite users",
  "users.delete": "Delete users",
};

const inviteUserSchema = z.object({
  email: z.email({ error: "Not a valid email" }),
  permissions: z.array(z.enum(USER_PERMISSIONS)),
});
type InviteUserInputs = z.infer<typeof inviteUserSchema>;

type Props = {
  onSuccess?: (
    result: FunctionReturnType<typeof api.invites.mutations.inviteUserMutation>,
  ) => void;
};
export const InviteUserForm: FC<Props> = ({ onSuccess }) => {
  const currentUser = useQuery(api.users.queries.currentUserQuery);

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
  } = useForm<InviteUserInputs>({
    defaultValues: { email: "", permissions: [] },
    resolver: zodResolver(inviteUserSchema),
  });

  const mutationFn = useConvexMutation(
    api.invites.mutations.inviteUserMutation,
  );
  const { mutate: inviteUser, isPending } = useMutation({
    mutationFn,
    onError: onFormError(setError),
    onSuccess: (result) => {
      reset();
      onSuccess?.(result);
    },
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit((data) =>
        inviteUser({ email: data.email, permissions: data.permissions }),
      )}
    >
      <FieldSet>
        <Field required>
          <FieldLabel htmlFor="email">User Email</FieldLabel>
          <Input
            type="email"
            id="email"
            {...register("email")}
            placeholder="john.doe@sb.com"
          />
          <FieldError>{errors.email?.message}</FieldError>
        </Field>

        <Field>
          <FieldTitle>Permissions</FieldTitle>
          <FieldDescription>
            You can only grant permissions you hold yourself.
          </FieldDescription>
          <Controller
            control={control}
            name="permissions"
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                {USER_PERMISSIONS.map((permission) => {
                  const enabled = currentUser?.permissions.includes(permission);
                  const checked = field.value.includes(permission);
                  return (
                    <FieldLabel
                      key={permission}
                      data-disabled={!enabled}
                      className="flex items-center justify-between gap-2 text-sm data-disabled:text-muted-foreground"
                    >
                      {PERMISSION_LABELS[permission]}
                      <Switch
                        size="sm"
                        disabled={!enabled}
                        checked={checked}
                        onCheckedChange={(on) => {
                          field.onChange(
                            on
                              ? [...field.value, permission]
                              : field.value.filter((p) => p !== permission),
                          );
                        }}
                      />
                    </FieldLabel>
                  );
                })}
              </div>
            )}
          />
          <FieldError>{errors.permissions?.message}</FieldError>
        </Field>

        <Button type="submit" disabled={isPending} className="ml-auto">
          <Send /> Send invite
        </Button>
      </FieldSet>
    </form>
  );
};
