import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  server: {
    host: "127.0.0.1",
    port: Number(process.env.PORT) || 5173,
  },
  logLevel: "warn",
  plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact(), nitro()],
});
