import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  logLevel: "warn",
  server: {
    host: "127.0.0.1",
    port: Number(process.env.PORT) || 5175,
  },
});
