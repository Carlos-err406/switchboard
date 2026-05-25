import { httpRouter } from 'convex/server'
import { auth } from './auth'
import { setupRestRoutes } from './sdk/http'

const http = httpRouter()

auth.addHttpRoutes(http)
setupRestRoutes(http)

export default http
