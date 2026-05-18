import type { api } from '#convex/_generated/api.js'
import type { FunctionReturnType } from 'convex/server'

export type ProjectSummary = FunctionReturnType<
  typeof api.models.projects.getProjectsQuery
>[number]

export type DetailedProject = FunctionReturnType<
  typeof api.models.projects.getProjectQuery
>

export type DetailedEnvironment = DetailedProject['environments'][number]
