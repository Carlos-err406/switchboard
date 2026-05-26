import { v } from 'convex/values'
import { internalMutation } from '../_generated/server.js'
import { mutationWithAudit } from '../lib/functions.js'
import { diffMetadata } from '../audit_logs/helpers.js'
import { getEnvironment } from '../environments/helpers.js'
import {
  apikeyAlreadyExist,
  apiKeyNotFound,
  environmentNotFound,
  noPermission,
  notAProjectMember,
  projectNotFound,
} from '../errors'
import { generateToken, hashString } from '../helpers.js'
import { getProjectUser } from '../project_users/helpers.js'
import { getProject } from '../projects/helpers.js'
import {
  API_KEY_PREFIX,
  getApiKey,
  getApiKeyByName,
  getApiKeyPreview,
} from './helpers'

export const createApiKeyMutation = mutationWithAudit({
  args: {
    environmentId: v.id('environments'),
    name: v.string(),
    description: v.optional(v.string()),
    expiresAt: v.nullable(v.number()),
  },
  handler: async (ctx, args) => {
    const environment = await getEnvironment(ctx, { id: args.environmentId })
    if (!environment) throw environmentNotFound()

    const [projectUser, existing, project] = await Promise.all([
      getProjectUser(ctx, {
        projectId: environment.projectId,
        userId: ctx.user._id,
      }),
      getApiKeyByName(ctx, {
        environmentId: environment._id,
        name: args.name,
      }),
      getProject(ctx, { id: environment.projectId }),
    ])

    if (!projectUser) throw notAProjectMember()
    if (!projectUser.permissions.includes('api_key.create'))
      throw noPermission('create api keys')
    if (!project) throw projectNotFound()
    if (existing) throw apikeyAlreadyExist()
    const apiKey = generateToken(API_KEY_PREFIX)
    const hash = await hashString(apiKey)
    const preview = getApiKeyPreview(apiKey)
    const keyId = await ctx.db.insert('apiKeys', {
      enabled: true,
      createdBy: ctx.user._id,
      environmentId: environment._id,
      expiresAt: args.expiresAt,
      name: args.name,
      keyPreview: preview,
      projectId: environment.projectId,
      keyHash: hash,
      description: args.description,
      lastUsedAt: null,
    })

    ctx.audit.log({
      action: 'created',
      resource: 'api_key',
      resourceId: keyId,
      projectId: project._id,
      message: `${ctx.user.email} created API key "${args.name}" in environment "${environment.name}"`,
      metadata: {
        name: args.name,
        environment: environment.name,
        project: project.name,
        preview,
      },
    })

    return { apiKey, preview }
  },
})

export const updateApiKeyMutation = mutationWithAudit({
  args: {
    apiKeyId: v.id('apiKeys'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    expiresAt: v.optional(v.nullable(v.number())),
    enabled: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const apiKey = await getApiKey(ctx, { id: args.apiKeyId })
    if (!apiKey) throw apiKeyNotFound()

    const [environment, projectUser, project, existingName] = await Promise.all(
      [
        getEnvironment(ctx, { id: apiKey.environmentId }),
        getProjectUser(ctx, {
          projectId: apiKey.projectId,
          userId: ctx.user._id,
        }),
        getProject(ctx, { id: apiKey.projectId }),
        args.name !== undefined
          ? getApiKeyByName(ctx, {
              environmentId: apiKey.environmentId,
              name: args.name,
            }).then(Boolean)
          : Promise.resolve(false),
      ],
    )

    if (existingName) throw apikeyAlreadyExist()
    if (!environment) throw environmentNotFound()
    if (!projectUser) throw notAProjectMember()
    if (!projectUser.permissions.includes('api_key.update'))
      throw noPermission('update api keys')
    if (!project) throw projectNotFound()

    const updated: typeof apiKey = {
      ...apiKey,
      name: args.name !== undefined ? args.name : apiKey.name,
      description:
        args.description !== undefined ? args.description : apiKey.description,
      expiresAt:
        args.expiresAt !== undefined ? args.expiresAt : apiKey.expiresAt,
      enabled: args.enabled !== undefined ? args.enabled : apiKey.enabled,
    }
    await ctx.db.replace('apiKeys', apiKey._id, updated)

    ctx.audit.log({
      action: 'updated',
      resource: 'api_key',
      resourceId: apiKey._id,
      projectId: project._id,
      message: `${ctx.user.email} updated API key "${apiKey.name}" in environment "${environment.name}"`,
      metadata: {
        environment: environment.name,
        project: project.name,
        preview: apiKey.keyPreview,
        ...diffMetadata(apiKey, updated),
      },
    })
  },
})

export const deleteApiKeyMutation = mutationWithAudit({
  args: { apiKeyId: v.id('apiKeys') },
  handler: async (ctx, args) => {
    const apiKey = await getApiKey(ctx, { id: args.apiKeyId })
    if (!apiKey) throw apiKeyNotFound()
    const [projectUser, project, environment] = await Promise.all([
      getProjectUser(ctx, {
        projectId: apiKey.projectId,
        userId: ctx.user._id,
      }),
      getProject(ctx, { id: apiKey.projectId }),
      getEnvironment(ctx, { id: apiKey.environmentId }),
    ])
    if (!environment) throw environmentNotFound()
    if (!projectUser) throw notAProjectMember()
    if (!projectUser.permissions.includes('api_key.delete'))
      throw noPermission('delete api keys')
    if (!project) throw projectNotFound()

    await ctx.db.delete('apiKeys', apiKey._id)

    ctx.audit.log({
      action: 'deleted',
      resource: 'api_key',
      resourceId: apiKey._id,
      projectId: project._id,
      message: `${ctx.user.email} deleted API key "${apiKey.name}" from environment "${environment.name}"`,
      metadata: {
        name: apiKey.name,
        environment: environment.name,
        project: project.name,
        preview: apiKey.keyPreview,
      },
    })
  },
})

export const rotateApiKeyMutation = mutationWithAudit({
  args: { apiKeyId: v.id('apiKeys') },
  handler: async (ctx, args) => {
    const apiKey = await getApiKey(ctx, { id: args.apiKeyId })
    if (!apiKey) throw apiKeyNotFound()
    const [projectUser, project, environment] = await Promise.all([
      getProjectUser(ctx, {
        projectId: apiKey.projectId,
        userId: ctx.user._id,
      }),
      getProject(ctx, { id: apiKey.projectId }),
      getEnvironment(ctx, { id: apiKey.environmentId }),
    ])
    if (!environment) throw environmentNotFound()
    if (!projectUser) throw notAProjectMember()
    if (!projectUser.permissions.includes('api_key.delete'))
      throw noPermission('delete api keys')
    if (!project) throw projectNotFound()
    const newKey = generateToken(API_KEY_PREFIX)
    const newHash = await hashString(newKey)
    const preview = getApiKeyPreview(newKey)
    await ctx.db.patch('apiKeys', apiKey._id, {
      keyHash: newHash,
      keyPreview: preview,
    })

    ctx.audit.log({
      action: 'rotated',
      resource: 'api_key',
      resourceId: apiKey._id,
      projectId: project._id,
      message: `${ctx.user.email} rotated API key "${apiKey.name}" in environment "${environment.name}"`,
      metadata: {
        name: apiKey.name,
        environment: environment.name,
        project: project.name,
        'preview.old': apiKey.keyPreview,
        'preview.new': preview,
      },
    })

    return { apiKey: newKey, preview }
  },
})

export const setLastUsed = internalMutation({
  args: { id: v.id('apiKeys') },
  handler: async (ctx, args) => {
    const apiKey = await getApiKey(ctx, { id: args.id })
    if (!apiKey) throw apiKeyNotFound()
    await ctx.db.patch('apiKeys', apiKey._id, { lastUsedAt: Date.now() })
  },
})
