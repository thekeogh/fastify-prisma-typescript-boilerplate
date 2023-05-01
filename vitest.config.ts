/// <reference types="vitest" />

import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [
    tsconfigPaths()
  ],
  test: {
    globals: true,
    watch: false,
    mockReset: true,
    passWithNoTests: true,
    include: ["./tests/**/*.test.ts"],
    setupFiles: ["dotenv-flow/config"],
    deps: {
      inline: ["@fastify/autoload"],
    },
  },
});