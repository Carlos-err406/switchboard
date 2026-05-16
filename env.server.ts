if (typeof window !== 'undefined')
  throw new Error('env.server.ts must not be imported on the client')

import { z } from 'zod'

export const serverEnv = z
  .object({
    NODE_ENV: z.enum(['development', 'production']).default('development'),

    CLERK_WEBHOOK_SECRET: z.string(),
    CLERK_WEBHOOK_SIGNING_SECRET: z.string(),

    PORT: z.coerce.number().optional(),
    NGROK_AUTH_TOKEN: z.string().optional(),
    NGROK_URL: z.string().optional(),
  })
  .refine(
    ({ NODE_ENV, NGROK_AUTH_TOKEN, NGROK_URL }) =>
      NODE_ENV !== 'development' || (!!NGROK_AUTH_TOKEN && !!NGROK_URL),
    { message: 'In development, NGROK variables are required' },
  )
  .parse(process.env)
