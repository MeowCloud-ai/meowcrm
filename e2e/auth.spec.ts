import { test, expect } from '@playwright/test'

test.describe('Auth Pages', () => {
  test('login page should render with email and password inputs', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('signup page should render', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible()
  })

  test('forgot password page should render', async ({ page }) => {
    await page.goto('/forgot-password')
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible()
  })

  test('login form empty submit should not navigate away', async ({ page }) => {
    await page.goto('/login')
    const submitBtn = page.getByRole('button', { name: /登入|login|sign in/i })
    await submitBtn.click()
    await expect(page).toHaveURL(/\/login/)
  })
})
