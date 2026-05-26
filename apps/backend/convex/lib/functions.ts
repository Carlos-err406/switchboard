import {
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import type { GenericQueryCtx } from "convex/server";
import { internal } from "../_generated/api.js";
import type { DataModel, Id } from "../_generated/dataModel.js";
import { internalMutation, mutation, query } from "../_generated/server.js";
import type { AuditAction, AuditResource } from "../audit_logs/helpers.js";
import { notAuthenticated } from "../errors";
import { getAuthUser } from "../users/helpers.js";

type AuditEntry = {
  action: AuditAction;
  resource: AuditResource;
  resourceId: string;
  projectId?: Id<"projects">;
  message: string;
  metadata?: Record<string, string>;
};

const resolveUser = async (ctx: GenericQueryCtx<DataModel>) => {
  const user = await getAuthUser(ctx);
  if (!user) throw notAuthenticated();
  return user;
};

export const authenticatedQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    const user = await resolveUser(ctx);
    return { user };
  }),
);

export const authenticatedMutation = customMutation(
  mutation,
  customCtx(async (ctx) => {
    const user = await resolveUser(ctx);
    return { user };
  }),
);

export const authenticatedInternalMutation = customMutation(
  internalMutation,
  customCtx(async (ctx) => {
    const user = await resolveUser(ctx);
    return { user };
  }),
);

export const mutationWithAudit = customMutation(mutation, {
  args: {},
  input: async (ctx) => {
    const user = await resolveUser(ctx);
    const pending: AuditEntry[] = [];

    const audit = {
      log: (entry: AuditEntry) => {
        pending.push(entry);
      },
    };

    return {
      ctx: { user, audit },
      args: {},
      onSuccess: async ({ ctx: originalCtx }) => {
        await Promise.all(
          pending.map((entry) =>
            originalCtx.runMutation(
              internal.audit_logs.mutations.logAuditEvent,
              {
                actor: user._id,
                ...entry,
              },
            ),
          ),
        );
      },
    };
  },
});
