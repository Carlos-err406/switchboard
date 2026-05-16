// routes/hello.ts
import { api } from '#convex/_generated/api';
import { convexClient } from '#/integrations/convex/client.ts';
import { serverEnv } from '#env/server';
import type {
    DeletedObjectJSON,
    UserJSON,
    WebhookEvent,
} from '@clerk/nextjs/server';
import { createFileRoute } from '@tanstack/react-router';
import { Webhook } from 'svix';

async function validateRequest(request: Request) {
  const payloadString = await request.text()
  const svixHeaders = {
    'svix-id': request.headers.get('svix-id')!,
    'svix-timestamp': request.headers.get('svix-timestamp')!,
    'svix-signature': request.headers.get('svix-signature')!,
  }
  if (
    request.headers.get('x-webhook-secret') != serverEnv.CLERK_WEBHOOK_SECRET
  ) {
    throw new Error('Invalid webhook secret header')
  }
  const wh = new Webhook(serverEnv.CLERK_WEBHOOK_SIGNING_SECRET)
  return wh.verify(payloadString, svixHeaders) as WebhookEvent
}

export const Route = createFileRoute('/api/clerk')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const payload = await validateRequest(request)
        await handleWebhook(payload)
        return new Response('ok')
      },
    },
  },
})

const handleCreateUser = async (payload: UserJSON) => {
  await convexClient.mutation(api.users.createUser, {
    auth_id: payload.id,
    email: payload.email_addresses[0]?.email_address ?? '',
    name: `${payload.first_name ?? ''} ${payload.last_name ?? ''}`.trim(),
    role: 'user',
  })
}

const handleDeleteUser = async (payload: DeletedObjectJSON) => {
  if (payload.deleted && payload.id) {
    await convexClient.mutation(api.users.deleteUser, { auth_id: payload.id })
  }
}

async function handleWebhook(event: WebhookEvent) {
  switch (event.type) {
    case 'user.created':
      return handleCreateUser(event.data)
    case 'user.deleted':
      return handleDeleteUser(event.data)
  }
}
