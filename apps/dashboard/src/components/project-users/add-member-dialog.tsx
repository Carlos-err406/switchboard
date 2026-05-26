import { Button, buttonVariants } from "@switchboard/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@switchboard/ui/components/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@switchboard/ui/components/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@switchboard/ui/components/select";
import { Switch } from "@switchboard/ui/components/switch";
import { onFormError } from "#/lib/utils.ts";
import { useHasProjectPermissions } from "#/hooks/use-has-permission.ts";
import { api } from "@convex/_generated/api.js";
import type { Id } from "@convex/_generated/dataModel.js";
import { PROJECT_USER_PERMISSIONS } from "@convex/schema/helpers.js";
import { useConvexMutation } from "@convex-dev/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "convex/react";
import { UserPlus } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod/v4";
import { PROJECT_PERMISSION_LABELS } from "./utils";

const schema = z.object({
  userId: z.string().min(1, "Select a user"),
  permissions: z.array(z.enum(PROJECT_USER_PERMISSIONS)),
});
type Inputs = z.infer<typeof schema>;

export const AddMemberDialog: FC<{ projectId: Id<"projects"> }> = ({
  projectId,
}) => {
  const [open, setOpen] = useState(false);
  const canAdd = useHasProjectPermissions(["member.add"], projectId);
  const users = useQuery(api.users.queries.getUsersQuery, open ? {} : "skip");
  const members = useQuery(
    api.project_users.queries.getProjectMembersQuery,
    open ? { projectId } : "skip",
  );
  const callerMembership = useQuery(api.projects.queries.getProjectUserQuery, {
    projectId,
  });

  const availableUsers = users?.filter(
    (u) => !members?.some((m) => m.userId === u._id),
  );

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
  } = useForm<Inputs>({
    defaultValues: { userId: "", permissions: [] },
    resolver: zodResolver(schema),
  });

  const mutationFn = useConvexMutation(
    api.project_users.mutations.addProjectMemberMutation,
  );
  const { mutate: addMember, isPending } = useMutation({
    mutationFn,
    onError: onFormError(setError),
    onSuccess: () => {
      reset();
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={buttonVariants({ variant: "default" })}
        disabled={!canAdd}
      >
        <UserPlus className="size-4" /> Add member
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add member</DialogTitle>
          <DialogDescription>
            Add an existing user to this project and assign their permissions.
          </DialogDescription>
        </DialogHeader>
        <form
          noValidate
          onSubmit={handleSubmit((data) =>
            addMember({
              projectId,
              userId: data.userId as Id<"users">,
              permissions: data.permissions,
            }),
          )}
        >
          <FieldSet>
            <Field required>
              <FieldLabel>User</FieldLabel>
              <Controller
                control={control}
                name="userId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUsers?.map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError>{errors.userId?.message}</FieldError>
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
                  <div className="grid grid-cols-2 gap-2">
                    {PROJECT_USER_PERMISSIONS.map((permission) => {
                      const enabled =
                        callerMembership?.permissions.includes(permission);
                      const checked = field.value.includes(permission);
                      return (
                        <div
                          key={permission}
                          className="flex items-center gap-2"
                        >
                          <Switch
                            size="sm"
                            id={`add-perm-${permission}`}
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
                            htmlFor={`add-perm-${permission}`}
                            data-disabled={!enabled}
                            className="flex items-center gap-2 data-disabled:text-muted-foreground"
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
              <UserPlus className="size-4" /> Add member
            </Button>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  );
};
