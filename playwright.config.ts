import { defineConfig, devices } from "@playwright/test";

/**
 * Visual verification harness (Cypress replacement).
 *
 * Port 5198 is deliberate: other dev sessions commonly hold the default 5173,
 * and --strictPort makes a collision fail loudly instead of silently testing
 * a different session's server.
 */
export default defineConfig({
  testDir: "e2e",
  outputDir: "e2e/test-results",
  timeout: 60_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:5198",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npx vite --port 5198 --strictPort",
    port: 5198,
    reuseExistingServer: true,
  },
  projects: [
    // Phone first: PRODUCT.md's primary surface. <=768px wide selects the
    // PhaseFilter Listbox layout; the #<Phase>-button radio ids only exist
    // on desktop.
    { name: "phone", use: { ...devices["Pixel 7"] } },
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 800 },
      },
    },
  ],
});
