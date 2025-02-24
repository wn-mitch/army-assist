import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    codeCoverage: {
      exclude: "cypress/**/*.*",
    },
  },
  e2e: {
    baseUrl: "http://localhost:4173",
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
