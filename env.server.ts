if (typeof window !== 'undefined')
  throw new Error('env.server.ts must not be imported on the client')

import { z } from 'zod'

export const serverEnv = z
  .object({
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    PORT: z.coerce.number().optional(),
  })
  .parse(process.env)
