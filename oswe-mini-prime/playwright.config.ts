import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/ui',
  timeout: 30 * 1000,
  expect: { timeout: 3000 },
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5174',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 5000,
    trace: 'on-first-retry'
  },
  projects: [
    { name: 'Chromium', use: {...devices['Desktop Chrome']} },
    { name: 'WebKit', use: {...devices['Desktop Safari']} }
  ]
});
