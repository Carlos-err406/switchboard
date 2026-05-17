import { z } from 'zod'

export const clientEnv = z
  .object({
    VITE_CONVEX_SITE_URL: z.url(),
    VITE_CONVEX_URL: z.url(),
  })
  .parse(import.meta.env)
