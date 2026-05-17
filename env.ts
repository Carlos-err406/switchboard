import { z } from 'zod'

export const clientEnv = z
  .object({
    VITE_CONVEX_SITE_URL: z.string().url(),
    VITE_CONVEX_URL: z.string().url(),
  })
  .parse(import.meta.env)
