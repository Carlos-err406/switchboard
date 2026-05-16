import { z } from 'zod'

export const clientEnv = z
  .object({
    VITE_CONVEX_URL: z.url(),
    VITE_CLERK_PUBLISHABLE_KEY: z.string(),
    VITE_CLERK_FRONTEND_API_URL: z.url(),
  })
  .parse(import.meta.env)
