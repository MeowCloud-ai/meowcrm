import { test, expect } from '@playwright/test'

test('debug Google OAuth full flow', async ({ page }) => {
  // Clear cookies
  await page.context().clearCookies()
  
  // Go to login
  await page.goto('https://crm.meowcloud.ai/login', { waitUntil: 'networkidle' })
  console.log('1. Login page URL:', page.url())
  
  // Click Google
  const googleBtn = page.locator('button:has-text("Google")')
  await googleBtn.click()
  
  // Wait for Google page
  await page.waitForURL(url => !url.toString().includes('crm.meowcloud.ai'), { timeout: 10000 })
  console.log('2. After Google click:', page.url())
  await page.screenshot({ path: '/tmp/debug-oauth-2.png', fullPage: true })
})

test('debug callback route directly', async ({ page }) => {
  // Simulate hitting callback with a dummy code
  const resp = await page.goto('https://crm.meowcloud.ai/auth/callback?code=test123', { waitUntil: 'networkidle' })
  console.log('3. Callback response status:', resp?.status())
  console.log('3. Final URL:', page.url())
  await page.screenshot({ path: '/tmp/debug-oauth-3.png', fullPage: true })
})

test('check middleware behavior on protected route', async ({ page }) => {
  await page.context().clearCookies()
  const resp = await page.goto('https://crm.meowcloud.ai/dashboard', { waitUntil: 'networkidle' })
  console.log('4. Dashboard (no auth) → Final URL:', page.url())
})
