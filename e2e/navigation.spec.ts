import { test, expect } from '@playwright/test'

test.describe('Navigation - Unauthenticated', () => {
  test('/dashboard should redirect to /login when not logged in', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
  })

  test('/customers should redirect to /login when not logged in', async ({ page }) => {
    await page.goto('/customers')
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
  })
})
