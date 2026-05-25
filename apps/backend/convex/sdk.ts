import type { HttpRouter } from 'convex/server'
import { httpActionGeneric } from 'convex/server'
import { internal } from './_generated/api'

export const setupRestRoutes = (http: HttpRouter) => {
  http.route({
    path: '/api/flags',
    method: 'GET',
    handler: httpActionGeneric(async (ctx, request) => {
      const authHeader = request.headers.get('authorization')
      const [scheme, apiKey] = authHeader?.split(' ') ?? []
      if (!apiKey || scheme !== 'Bearer')
        return new Response('Unauthorized', { status: 401 })

      const storedKey = await ctx.runQuery(
        internal.api_keys.queries.getApiKeyByValueQuery,
        {
          value: apiKey,
        },
      )

      if (!storedKey) return new Response('Unauthorized', { status: 401 })
      if (Date.now() >= (storedKey.expiresAt ?? Infinity))
        return new Response('API Key expired', { status: 401 })
      if (!storedKey.enabled)
        return new Response('API key disabled', { status: 403 })

      const url = new URL(request.url)
      const flagKey = url.searchParams.get('flag')
      if (!flagKey)
        return new Response('No flag to query in the request', { status: 400 })

      const flag = await ctx.runQuery(
        internal.flags.queries.getFlagByKeyQuery,
        {
          key: flagKey,
          environmentId: storedKey.environmentId,
        },
      )

      if (!flag) return new Response('Flag not found', { status: 404 })

      await ctx.scheduler.runAfter(0, internal.api_keys.mutations.setLastUsed, {
        id: storedKey._id,
      })
      return new Response(
        JSON.stringify({
          value: flag.value,
          flag: flag.key,
          enabled: flag.enabled,
        }),
        {
          headers: [['content-type', 'application/json']],
          status: 200,
        },
      )
    }),
  })
}
