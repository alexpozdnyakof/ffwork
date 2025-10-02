import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  projects: ["packages/*, examples/*, libs/*"],
  test: {
    reporters: "verbose",
    environment: "jsdom",
    logLevel: "info",
  },
  resolve: {
    alias: {
      "@fwork/router": path.resolve(
        __dirname,
        "packages/router/dist/index.mjs"
      ),
    },
  },
  server: {
    fs: {
      allow: ["./packages/*, ./libs"],
    },
  },
});
