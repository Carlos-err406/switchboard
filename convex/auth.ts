import {
  convexAuth,
  createAccount,
  retrieveAccount,
} from '@convex-dev/auth/server'
import { ConvexCredentials } from '@convex-dev/auth/providers/ConvexCredentials'
import { Scrypt } from 'lucia'
import type { Id } from './_generated/dataModel'

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    ConvexCredentials({
      id: 'password',
      authorize: async (params, ctx) => {
        const email = params.email as string
        const password = params.password as string
        if (!email || !password) {
          throw new Error('Email and password are required')
        }

        if (email === process.env.ADMIN_EMAIL) {
          if (password !== process.env.ADMIN_PASSWORD) {
            throw new Error('Invalid credentials')
          }

          try {
            const existing = await retrieveAccount(ctx, {
              provider: 'password',
              account: { id: email },
            })
            return { userId: existing.user._id }
          } catch {
            const created = await createAccount(ctx, {
              provider: 'password',
              account: { id: email, secret: password },
              profile: {
                email,
                role: 'admin' as const,
                name: 'Administrator',
                permissions: ['project.create', 'user.invite', 'user.delete'],
              },
            })
            return { userId: created.user._id }
          }
        }
        const retrieved = await retrieveAccount(ctx, {
          provider: 'password',
          account: { id: email, secret: password },
        })
        if (!retrieved.user._id) {
          throw new Error('Invalid credentials')
        }
        return { userId: retrieved.user._id }
      },
      crypto: {
        async hashSecret(password) {
          return await new Scrypt().hash(password)
        },
        async verifySecret(password, hash) {
          return await new Scrypt().verify(hash, password)
        },
      },
    }),
  ],
})
