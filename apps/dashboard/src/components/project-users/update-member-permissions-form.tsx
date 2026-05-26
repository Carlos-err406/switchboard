import { Button } from "@switchboard/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@switchboard/ui/components/field";
import { Switch } from "@switchboard/ui/components/switch";
import { onFormError } from "#/lib/utils.ts";
import { api } from "@convex/_generated/api.js";
import type { Doc } from "@convex/_generated/dataModel.js";
import { PROJECT_USER_PERMISSIONS } from "@convex/schema/helpers.js";
import { useConvexMutation } from "@convex-dev/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "convex/react";
import type { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod/v4";
import { PROJECT_PERMISSION_LABELS } from "./utils";

type MemberWithUser = Doc<"projectUsers"> & { email: string };

const schema = z.object({
  permissions: z.array(z.enum(PROJECT_USER_PERMISSIONS)),
});
type Inputs = z.infer<typeof schema>;

export const UpdateMemberPermissionsForm: FC<{
  member: MemberWithUser;
  onSuccess?: () => void;
}> = ({ member, onSuccess }) => {
  const callerMembership = useQuery(api.projects.queries.getProjectUserQuery, {
    projectId: member.projectId,
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<Inputs>({
    defaultValues: { permissions: [...member.permissions] },
    resolver: zodResolver(schema),
  });

  const mutationFn = useConvexMutation(
    api.project_users.mutations.updateProjectMemberPermissionsMutation,
  );
  const { mutate: update, isPending } = useMutation({
    mutationFn,
    onError: onFormError(setError),
    onSuccess,
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit((data) =>
        update({
          id: member._id,
          permissions: data.permissions,
        }),
      )}
    >
      <FieldSet>
        <Field>
          <FieldTitle>Permissions</FieldTitle>
          <FieldDescription>
            You can only grant permissions you hold yourself.
          </FieldDescription>

          <Controller
            control={control}
            name="permissions"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2">
                {PROJECT_USER_PERMISSIONS.map((permission) => {
                  const enabled =
                    callerMembership?.permissions.includes(permission);
                  const checked = field.value.includes(permission);
                  return (
                    <div key={permission} className="flex items-center gap-2">
                      <Switch
                        size="sm"
                        id={`perm-${member._id}-${permission}`}
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
                      <FieldLabel
                        htmlFor={`perm-${member._id}-${permission}`}
                        data-disabled={!enabled}
                        className="flex items-center justify-between gap-2 data-disabled:text-muted-foreground"
                      >
                        {PROJECT_PERMISSION_LABELS[permission]}
                      </FieldLabel>
                    </div>
                  );
                })}
              </div>
            )}
          />
          <FieldError>{errors.permissions?.message}</FieldError>
        </Field>

        <Button type="submit" disabled={isPending} className="ml-auto">
          {isPending ? "Saving..." : "Save permissions"}
        </Button>
      </FieldSet>
    </form>
  );
};
