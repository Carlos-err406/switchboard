import { onFormError } from "#/lib/utils.ts";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api.js";
import type { Doc } from "@convex/_generated/dataModel.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@switchboard/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@switchboard/ui/components/field";
import { Input } from "@switchboard/ui/components/input";
import { useMutation } from "@tanstack/react-query";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updateFlagSchema = z.object({
  key: z.string().min(3, "Must have at least 3 characters"),
  description: z.string().optional(),
  payload: z
    .union([z.string(), z.null(), z.boolean(), z.undefined(), z.number()])
    .transform((arg) => {
      if (arg === "null" || arg === null) return null;
      if (arg === "true" || arg === true) return true;
      if (arg === "false" || arg === false) return false;
      if (/^\d+$/.test(String(arg))) return Number(arg);
      const strArg = String(arg);
      if (!strArg || strArg.trim() === "") return undefined;
      return String(arg);
    }),
});
type UpdateFlagInputs = z.infer<typeof updateFlagSchema>;
type Props = {
  flag: Doc<"flags">;
  onSuccess?: () => void;
};
export const UpdateFlagForm: FC<Props> = ({ flag, onSuccess }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
  } = useForm<UpdateFlagInputs>({
    defaultValues: {
      key: flag.key,
      description: flag.description,
      payload: flag.payload !== undefined ? String(flag.payload) : "",
    },
    resolver: zodResolver(updateFlagSchema),
  });

  const mutationFn = useConvexMutation(api.flags.mutations.updateFlagMutation);
  const { mutate: updateFlag, isPending } = useMutation({
    mutationFn,
    onError: onFormError(setError),
    onSuccess: () => {
      onSuccess?.();
      reset();
    },
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit((data) =>
        updateFlag({
          flagId: flag._id,
          key: data.key,
          payload: data.payload,
          description: data.description,
        }),
      )}
    >
      <FieldSet>
        <Field required>
          <FieldLabel htmlFor="key">Flag Key</FieldLabel>
          <Input id="key" {...register("key")} placeholder="logs.enable" />
          <FieldError>{errors.key?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="payload">Payload</FieldLabel>
          <Input
            id="payload"
            {...register("payload")}
            placeholder={"OFF | null | true | 99 | hi"}
          />
          <FieldDescription>
            Optional extra data sent to clients alongside the flag state.
          </FieldDescription>
          <FieldError>{errors.payload?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Flag Description</FieldLabel>
          <Input
            id="description"
            {...register("description")}
            placeholder="Enables the logs client-side"
          />

          <FieldError>{errors.description?.message}</FieldError>
        </Field>
        <Button type="submit" disabled={isPending} className="ml-auto">
          Submit
        </Button>
      </FieldSet>
    </form>
  );
};
