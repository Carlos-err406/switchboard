import { z } from "zod";

export const env = z
  .object({
    VITE_CONVEX_SITE_URL: z.string().url(),
    VITE_CONVEX_URL: z.string().url(),
    VITE_LANDING_URL: z.string().url(),
  })
  .parse(import.meta.env);
