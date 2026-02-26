import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
  webServer: {
    command: 'pnpm dev',
    port: 3000,
    timeout: 60000,
    reuseExistingServer: true,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: 'https://euycsevjwwisgtbmemsx.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'dummy-for-e2e',
    },
  },
})
