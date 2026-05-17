import { serverEnv } from '#env/server'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { createServer, defineConfig } from 'vite'

const viteServerConfig = defineConfig({
  resolve: { tsconfigPaths: true },
  server: {
    host: '127.0.0.1',
    port: serverEnv.PORT || 5173,
  },
  plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact()],
})

async function start() {
  // VITE
  const server = await createServer({ configFile: false, ...viteServerConfig })
  await server.listen()
  server.bindCLIShortcuts({ print: true })
  console.log('VITE server up')
}

start()
