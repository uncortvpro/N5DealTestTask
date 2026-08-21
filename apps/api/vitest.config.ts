import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@n5deal/shared": path.resolve(__dirname, "../../packages/shared/src/index.ts"),
    },
  },
  test: {
    environment: "node",
    env: {
      JWT_SECRET: "test-secret-do-not-use-in-production",
      NODE_ENV: "test",
    },
  },
});
