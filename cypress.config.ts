import { defineConfig } from "cypress";


export default defineConfig({
  projectId: process.env.CYPRESS_PROJECT_ID || '',
  e2e: {
    baseUrl: process.env.PUBLIC_URL || 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
