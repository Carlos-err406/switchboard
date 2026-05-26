import { z } from "zod";

if (typeof window !== "undefined")
  throw new Error("env.server.ts must not be imported on the client");

export const env = z
  .object({
    ADMIN_EMAIL: z.string().email(),
    ADMIN_PASSWORD: z.string(),
    SMTP_SERVER: z.string(),
    SMTP_FROM: z.string(),
    SITE_URL: z.string().url(),
    ORG_NAME: z.string().optional().default("Your organization"),
    PLATFORM_NAME: z.string().optional().default("Switchboard"),
  })
  .parse(process.env);
