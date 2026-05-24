import { internal } from '../_generated/api.js'
import { mutation } from '../_generated/server.js'
import { getProjectEnvironments } from '../environments/helpers.js'
import { getProjectFlags } from '../flags/helpers.js'
import {
  getProjectUser,
  getProjectUsers,
} from '../project_users/helpers.js'
import { getAuthUser } from '../users/helpers.js'
import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'
import {
  noPermission,
  notAProjectMember,
  notAuthenticated,
  projectAlreadyExist,
  projectNotFound,
} from '../errors'
import { getProject, getProjectByName } from './helpers'

export const createProjectMutation = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx)
    if (!user) throw notAuthenticated()
    if (!user.permissions.includes('projects.create'))
      throw noPermission('create projects')
    const existing = await getProjectByName(ctx, { name: args.name })
    if (existing) throw projectAlreadyExist()

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

      ctx.db.insert('environments', {
        projectId: inserted,
        name: 'Production',
      }),
    ])
    return inserted
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
        ctx.runQuery(internal.api_keys.helpers.getProjectApiKeys, {
          projectId: project._id,
        }),
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

export const renameProjectMutation = mutation({
  args: { id: v.id('projects'), name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw notAuthenticated()

    const [project, existing, projectUser] = await Promise.all([
      getProject(ctx, args),
      getProjectByName(ctx, { name: args.name }),
      getProjectUser(ctx, {
        projectId: args.id,
        userId,
      }),
    ])

    if (!project) throw projectNotFound()
    if (!projectUser) throw notAProjectMember()
    if (!projectUser.permissions.includes('project.update'))
      throw noPermission('update projects')
    if (existing) throw projectAlreadyExist()
    await ctx.db.patch('projects', args.id, { name: args.name })
  },
})
