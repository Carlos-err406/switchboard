import { authTables } from '@convex-dev/auth/server'
import { defineSchema } from 'convex/server'
import * as tables from './schema/tables'

export default defineSchema({
  ...authTables,
  ...tables,
})
