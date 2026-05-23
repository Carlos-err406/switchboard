import { z } from 'zod'

if (typeof window !== 'undefined')
  throw new Error('env.server.ts must not be imported on the client')

export const serverEnv = z
  .object({
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    PORT: z.number({ coerce: true }).optional(),
  })
  .parse(process.env)
