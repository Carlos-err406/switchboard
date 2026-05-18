import { mutation, query } from '#convex/_generated/server.js'
import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'
import {
  noPermission,
  notAProjectMember,
  notAuthenticated,
  projectNotFound,
} from '../errors'
import {
  getAuthUser,
  getEnvironmentFlags,
  getProject,
  getProjectApiKeys,
  getProjectEnvironments,
  getProjectFlags,
  getProjectUser,
  getProjectUsers,
  getUserProjects,
} from './helpers'

export const getProjectsQuery = query({
  args: { q: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw notAuthenticated()

    const userProjects = await getUserProjects(ctx, { ...args, id: userId })

    const projects = await Promise.all(
      userProjects.map(async (userProject) => {
        const [project, environments, flags, projectMembers] =
          await Promise.all([
            getProject(ctx, { id: userProject.projectId }),
            getProjectEnvironments(ctx, { id: userProject.projectId }),
            getProjectFlags(ctx, { id: userProject.projectId }),
            getProjectUsers(ctx, { id: userProject.projectId }),
          ])

        return project
          ? {
              ...project,
              permissions: userProject.permissions,
              environmentsCount: environments.length,
              flagsCount: flags.length,
              membersCount: projectMembers.length,
            }
          : null
      }),
    )

    return projects.filter((p): p is NonNullable<typeof p> =>
      Boolean(p?.name.includes(args.q || '')),
    )
  },
})

export const getProjectQuery = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx)
    if (!user) throw notAuthenticated()
    const projectUser = await getProjectUser(ctx, {
      projectId: args.projectId,
      userId: user._id,
    })
    if (!projectUser && user.role !== 'admin') throw notAProjectMember()
    const project = await getProject(ctx, { id: args.projectId })
    if (!project) throw projectNotFound()
    const environments = await getProjectEnvironments(ctx, {
      id: args.projectId,
    })
    const richEnvironments = await Promise.all(
      environments.map(async (environment) => {
        const flags = await getEnvironmentFlags(ctx, { id: environment._id })
        return { ...environment, flags }
      }),
    )
    return { ...project, environments: richEnvironments }
  },
})

export const createProjectMutation = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx)
    if (!user) throw notAuthenticated()
    if (!user.permissions.includes('project.create'))
      throw noPermission('create projects')
    const inserted = await ctx.db.insert('projects', args)
    await Promise.all([
      // insert the creator in to the project users with full permissions
      ctx.db.insert('projectUsers', {
        projectId: inserted,
        userId: user._id,
        permissions: [
          'api_key.create',
          'api_key.delete',
          'api_key.update',
          'flag.create',
          'flag.delete',
          'flag.update',
          'member.add',
          'member.remove',
          'project.delete',
          'project.update',
          'environment.create',
          'environment.delete',
          'environment.update',
        ],
      }),
      // create the default environment
      ctx.db.insert('environments', {
        projectId: inserted,
        name: 'Default',
      }),
    ])
  },
})

export const deleteProjectMutation = mutation({
  args: { id: v.id('projects') },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx)
    if (!user) throw notAuthenticated()
    const project = await getProject(ctx, args)
    if (!project) throw projectNotFound()

    const projectUser = await getProjectUser(ctx, {
      projectId: project._id,
      userId: user._id,
    })
    if (user.role !== 'admin') {
      if (!projectUser) throw notAProjectMember()
      if (!projectUser.permissions.includes('project.delete'))
        throw noPermission('delete projects')
    }

    const [projectUsers, projectFlags, projectApiKeys, projectEnvironments] =
      await Promise.all([
        getProjectUsers(ctx, { id: project._id }),
        getProjectFlags(ctx, { id: project._id }),
        getProjectApiKeys(ctx, { id: project._id }),
        getProjectEnvironments(ctx, {
          id: project._id,
        }),
      ])

    await Promise.all([
      ctx.db.delete(args.id),
      ...projectUsers.map((pu) => ctx.db.delete(pu._id)),
      ...projectFlags.map((pf) => ctx.db.delete(pf._id)),
      ...projectEnvironments.map((pe) => ctx.db.delete(pe._id)),
      ...projectApiKeys.map((ak) => ctx.db.delete(ak._id)),
    ])
  },
})

export const updateProjectNameMutation = mutation({
  args: { id: v.id('projects'), name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw notAuthenticated()
    const project = await getProject(ctx, args)
    if (!project) throw projectNotFound()
    const projectUser = await getProjectUser(ctx, {
      projectId: project._id,
      userId,
    })
    if (!projectUser) throw notAProjectMember()
    if (!projectUser.permissions.includes('project.update'))
      throw noPermission('update projects')
    await ctx.db.patch('projects', args.id, { name: args.name })
  },
})
