import HeaderUser from '#/integrations/clerk/header-user.tsx'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="p-8">
      <section className="flex items-center justify-end">
        <HeaderUser />
      </section>
      <h1 className="text-4xl font-bold">landing here</h1>
    </div>
  )
}
