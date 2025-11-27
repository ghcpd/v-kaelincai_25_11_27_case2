import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/playwright',
  timeout: 30_000,
  retries: 0,
  outputDir: './tests/playwright/test-results',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    headless: true,
    viewport: { width: 1280, height: 800 },
    screenshot: 'on',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: { browserName: 'chromium', viewport: { width: 1280, height: 800 } }
    }
  ]
})
