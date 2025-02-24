import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "wdgobv",
  e2e: {
    baseUrl: "http://localhost:4173",
    setupNodeEvents: async (on, config) => {
      const { default: task } = await import('@cypress/code-coverage/task');
      task(on, config);
      return config;
    },
    viewportWidth:1080,
    viewportHeight: 810,
  },
});
