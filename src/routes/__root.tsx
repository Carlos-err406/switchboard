import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import relativeTime from 'dayjs/plugin/relativeTime'
import ConvexProvider from '../integrations/convex/provider'

import appCss from '../styles.css?url'

import { Header } from '#/components/layout/header.tsx'
import { Toaster } from '#/components/ui/sonner'
import { TooltipProvider } from '#/components/ui/tooltip.tsx'
import type { ConvexQueryClient } from '@convex-dev/react-query'
import type { QueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { z } from 'zod'

interface MyRouterContext {
  queryClient: QueryClient
  convexQueryClient: ConvexQueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  validateSearch: z.object({ q: z.string().optional() }).parse,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Open Flagger',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  dayjs.extend(relativeTime)

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <TooltipProvider>
          <ConvexProvider>
            <Header />
            {children}
            <Toaster />
          </ConvexProvider>
          <Scripts />
        </TooltipProvider>
      </body>
    </html>
  )
}
