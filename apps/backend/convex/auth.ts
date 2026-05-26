import { ConvexCredentials } from "@convex-dev/auth/providers/ConvexCredentials";
import {
  convexAuth,
  createAccount,
  retrieveAccount,
} from "@convex-dev/auth/server";
import { Scrypt } from "lucia";
import { internal } from "./_generated/api";
import { env } from "./env";
import { USER_PERMISSIONS } from "./schema/helpers";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    ConvexCredentials({
      id: "password",
      authorize: async (params, ctx) => {
        const email = params.email as string;
        const password = params.password as string;
        const inviteToken = params.inviteToken as string | undefined;

        if (!password) {
          throw new Error("Password is required");
        }

        if (inviteToken) {
          const invite = await ctx.runQuery(
            internal.invites.queries.getInviteByTokenInternal,
            { token: inviteToken },
          );
          if (!invite) throw new Error("Invitation not found");
          if (invite.used) throw new Error("Invitation has already been used");
          if (Date.now() > invite.expiresAt)
            throw new Error("Invitation has expired");

          const created = await createAccount(ctx, {
            provider: "password",
            shouldLinkViaEmail: true,
            account: { id: invite.toEmail, secret: password },
            profile: {
              email: invite.toEmail,
              locked: false,
              role: "member" as const,
              permissions: invite.permissions,
            },
          });

          await ctx.runMutation(internal.invites.mutations.markInviteAsUsed, {
            id: invite._id,
          });
          return { userId: created.user._id };
        }

        if (!email) {
          throw new Error("Email is required");
        }

        if (email === env.ADMIN_EMAIL) {
          const result = await retrieveAccount(ctx, {
            provider: "password",
            account: { id: email, secret: password },
          })
            .then((r) => r)
            .catch((e) => e);

          if (typeof result === "object" && "user" in result) {
            if (result.user.locked) throw new Error("Account is locked");
            return { userId: result.user._id };
          }

          const errMsg =
            result instanceof Error ? result.message : String(result);

          if (errMsg.includes("InvalidSecret"))
            throw new Error("Invalid credentials");

          if (
            errMsg.includes("TooManyFailedAttempts") ||
            errMsg.includes("rate")
          )
            throw new Error("Too many failed attempts. Try again later.");

          if (password !== env.ADMIN_PASSWORD)
            throw new Error("Invalid credentials");

          const created = await createAccount(ctx, {
            provider: "password",
            shouldLinkViaEmail: true,
            account: { id: email, secret: password },
            profile: {
              email,
              locked: false,
              role: "admin" as const,
              permissions: [...USER_PERMISSIONS],
            },
          });
          return { userId: created.user._id };
        }
        const retrieved = await retrieveAccount(ctx, {
          provider: "password",
          account: { id: email, secret: password },
        });
        if (!retrieved.user._id) {
          throw new Error("Invalid credentials");
        }
        if (retrieved.user.locked) {
          throw new Error("Account is locked");
        }
        return { userId: retrieved.user._id };
      },
      crypto: {
        async hashSecret(password) {
          return await new Scrypt().hash(password);
        },
        async verifySecret(password, hash) {
          return await new Scrypt().verify(hash, password);
        },
      },
    }),
  ],
});
