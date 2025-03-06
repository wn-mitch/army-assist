/* eslint-disable @typescript-eslint/no-require-imports */
import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "wdgobv",

  env: {
    codeCoverage: {
      exclude: "cypress/**/*.*",
    },
  },

  e2e: {
    baseUrl: "http://localhost:4173",
    experimentalRunAllSpecs: true,
    async setupNodeEvents(on, config) {
      const { default: task } = await import("@cypress/code-coverage/task");
      task(on, config);
      return config;
    },
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    async setupNodeEvents(on, config) {
      const { default: task } = await import("@cypress/code-coverage/task");
      task(on, config);
      return config;
    },
  },
});