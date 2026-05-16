import { clientEnv } from '#env'
import { ConvexHttpClient } from 'convex/browser'

export const convexClient = new ConvexHttpClient(clientEnv.VITE_CONVEX_URL)
