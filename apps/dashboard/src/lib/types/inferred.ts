import type { api } from '@convex/_generated/api.js'
import type { FunctionReturnType } from 'convex/server'

export type ProjectSummary = FunctionReturnType<
  typeof api.projects.queries.getProjectsQuery
>[number]

export type DetailedProject = FunctionReturnType<
  typeof api.projects.queries.getProjectQuery
>

export type EnvironmentSummary = FunctionReturnType<
  typeof api.environments.queries.getEnvironmentsQuery
>[number]

export type DetailedApiKey = FunctionReturnType<
  typeof api.api_keys.queries.getApiKeysQuery
>[number]
