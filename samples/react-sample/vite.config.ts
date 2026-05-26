import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  logLevel: "warn",
  server: {
    host: "127.0.0.1",
    port: Number(process.env.PORT) || 5174,
  },
});
