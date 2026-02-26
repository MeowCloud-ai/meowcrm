import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('should load and display hero heading', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('你專心開會')
  })

  test('should have CTA buttons', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /免費開始/ }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /登入/ }).first()).toBeVisible()
  })

  test('should have aurora gradient background elements', async ({ page }) => {
    await page.goto('/')
    const gradients = page.locator('.blur-3xl')
    await expect(gradients.first()).toBeAttached()
  })
})
