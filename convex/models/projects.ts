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
  getProjectApiKeys,
  getProjectById,
  getProjectEnvironments,
  getProjectFlags,
  getProjectUser,
  getProjectUsers,
  getUserProjects,
} from './helpers'

export const getUserProjectsQuery = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw notAuthenticated()

    const userProjects = await getUserProjects(ctx, { id: userId })

    const projects = await Promise.all(
      userProjects.map(async (userProject) => {
        const [project, environments, flags, projectMembers] =
          await Promise.all([
            getProjectById(ctx, { id: userProject.projectId }),
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

    return projects.filter((p) => p !== null)
  },
})

export const getUserProjectQuery = query({
  args: { id: v.id('projects') },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx)
    if (!user) throw notAuthenticated()
    const projectUser = await getProjectUser(ctx, {
      projectId: args.id,
      userId: user._id,
    })
    if (!projectUser && user.role !== 'admin') throw notAProjectMember()
    return await getProjectById(ctx, { id: args.id })
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
    await ctx.db.insert('projectUsers', {
      projectId: inserted,
      userId: user._id,
      permissions: [
        'api_key.create',
        'api_key.delete',
        'api_key.update',
        'flag.create',
        'flag.delete',
        'flag.update',
        'member.invite',
        'member.remove',
        'project.delete',
        'project.update',
      ],
    })
    return inserted
  },
})

export const deleteProjectMutation = mutation({
  args: { id: v.id('projects') },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx)
    if (!user) throw notAuthenticated()
    const project = await getProjectById(ctx, args)
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
    const projectFlagValues = (
      await Promise.all(
        projectFlags.map((pf) =>
          ctx.db
            .query('flagValues')
            .withIndex('flagId', (q) => q.eq('flagId', pf._id))
            .collect(),
        ),
      )
    ).flat()

    await Promise.all([
      ctx.db.delete(args.id),
      ...projectUsers.map((pu) => ctx.db.delete(pu._id)),
      ...projectFlags.map((pf) => ctx.db.delete(pf._id)),
      ...projectFlagValues.map((pfv) => ctx.db.delete(pfv._id)),
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
    const project = await getProjectById(ctx, args)
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
