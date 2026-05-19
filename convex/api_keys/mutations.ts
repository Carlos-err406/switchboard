// export const createApiKeyMutation = mutation({
//   args: { projectId: v.id('projects'), name: v.string() },
//   handler: async (ctx, args) => {
//     const userId = await getAuthUserId(ctx)
//     if (!userId) throw notAuthenticated()
//     const projectUser = await getProjectUser(ctx, {
//       projectId: args.projectId,
//       userId: userId,
//     })
//     if (!projectUser) throw notAProjectMember()
//     if (!projectUser.permissions.includes('environment.create'))
//       throw noPermission('create environments')
//     const project = await getProject(ctx, { id: args.projectId })
//     if (!project) throw projectNotFound()
//     const existing = await getApiKeyByName(ctx, { name: args.name })
//     if (existing) throw environmentAlreadyExist()
//     return await ctx.db.insert('environments', {
//       projectId: args.projectId,
//       name: args.name,
//     })
//   },
// })

// export const deleteApiKeyMutation = mutation({
//   args: { projectId: v.id('projects'), environmentId: v.id('environments') },
//   handler: async (ctx, args) => {
//     const userId = await getAuthUserId(ctx)
//     if (!userId) throw notAuthenticated()
//     const projectUser = await getProjectUser(ctx, {
//       projectId: args.projectId,
//       userId: userId,
//     })
//     if (!projectUser) throw notAProjectMember()
//     if (!projectUser.permissions.includes('environment.delete'))
//       throw noPermission('delete environments')
//     const flags = await getApiKeyFlags(ctx, { id: args.environmentId })
//     await Promise.all([
//       ctx.db.delete('environments', args.environmentId),
//       ...flags.map((f) => ctx.db.delete('flags', f._id)),
//     ])
//   },
// })
