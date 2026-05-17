import { mutation, query } from '#convex/_generated/server.js'
import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'
import {
  noPermission,
  notAProjectMember,
  notAuthenticated,
  projectNotFound,
} from '../errors'
import { getAuthUser } from './helpers'

export const getUserProjects = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw notAuthenticated()

    const memberships = await ctx.db
      .query('projectUsers')
      .withIndex('userId', (q) => q.eq('userId', userId))
      .collect()

    const projects = await Promise.all(
      memberships.map(async (m) => {
        const project = await ctx.db
          .query('projects')
          .withIndex('by_id', (q) => q.eq('_id', m.projectId))
          .unique()
        const environments = await ctx.db
          .query('environments')
          .withIndex('projectId', (q) => q.eq('projectId', m.projectId))
          .collect()
        const flags = await ctx.db
          .query('flags')
          .withIndex('projectId', (q) => q.eq('projectId', m.projectId))
          .collect()

        return project
          ? {
              ...project,
              permissions: m.permissions,
              environmentsCount: environments.length,
              flagsCount: flags.length,
            }
          : null
      }),
    )

    return projects.filter((p) => p !== null)
  },
})

export const createProject = mutation({
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

export const deleteProject = mutation({
  args: { id: v.id('projects') },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx)
    if (!user) throw notAuthenticated()
    const project = await ctx.db
      .query('projects')
      .withIndex('by_id', (q) => q.eq('_id', args.id))
      .unique()
    if (!project) throw projectNotFound()

    const projectUser = await ctx.db
      .query('projectUsers')
      .withIndex('projectUser', (q) =>
        q.eq('projectId', args.id).eq('userId', user._id),
      )
      .unique()
    if (user.role !== 'admin') {
      if (!projectUser) throw notAProjectMember()
      if (!projectUser.permissions.includes('project.delete'))
        throw noPermission('delete projects')
    }

    const projectUsers = await ctx.db
      .query('projectUsers')
      .withIndex('projectId', (q) => q.eq('projectId', args.id))
      .collect()
    const projectFlags = await ctx.db
      .query('flags')
      .withIndex('projectId', (q) => q.eq('projectId', args.id))
      .collect()
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
    const projectEnvironments = await ctx.db
      .query('environments')
      .withIndex('projectId', (q) => q.eq('projectId', args.id))
      .collect()
    const projectApiKeys = await ctx.db
      .query('apiKeys')
      .withIndex('projectId', (q) => q.eq('projectId', args.id))
      .collect()
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
