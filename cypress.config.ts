import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "wdgobv",
  e2e: {
    baseUrl: "http://localhost:4173",
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)
      return config
    },
    viewportWidth:1080,
    viewportHeight: 810,
  },
});
