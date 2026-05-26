import { Button } from "@switchboard/ui/components/button";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@switchboard/ui/components/field";
import { Input } from "@switchboard/ui/components/input";
import { useHasPermissions } from "#/hooks/use-has-permission.ts";
import { onFormError } from "#/lib/utils.ts";
import { api } from "@convex/_generated/api.js";
import { useConvexMutation } from "@convex-dev/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { FunctionReturnType } from "convex/server";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createProjectSchema = z.object({
  name: z.string().min(3, "Must have at least 3 characters"),
});
type CreateProjectInputs = z.infer<typeof createProjectSchema>;
type Props = {
  onSuccess?: (
    result: FunctionReturnType<
      typeof api.projects.mutations.createProjectMutation
    >,
  ) => void;
};
export const CreateProjectForm: FC<Props> = ({ onSuccess }) => {
  const canCreateProjects = useHasPermissions(["projects.create"]);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
  } = useForm<CreateProjectInputs>({
    defaultValues: { name: "" },
    disabled: !canCreateProjects,
    resolver: zodResolver(createProjectSchema),
  });

  const mutationFn = useConvexMutation(
    api.projects.mutations.createProjectMutation,
  );
  const { mutate: createProject, isPending } = useMutation({
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
      onSubmit={handleSubmit((data) => createProject({ name: data.name }))}
    >
      <FieldSet disabled={!canCreateProjects}>
        <Field required>
          <FieldLabel htmlFor="name">Project Name</FieldLabel>
          <Input id="name" {...register("name")} placeholder="Acme project" />
          <FieldError>{errors.name?.message}</FieldError>
        </Field>
        <Button type="submit" disabled={isPending} className="ml-auto">
          Submit
        </Button>
      </FieldSet>
    </form>
  );
};
