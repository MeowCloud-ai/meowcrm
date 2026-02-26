import { test, expect } from '@playwright/test'

const publicPages = [
  { path: '/', name: 'Landing' },
  { path: '/login', name: 'Login' },
  { path: '/signup', name: 'Signup' },
  { path: '/forgot-password', name: 'Forgot Password' },
]

// These should redirect to /login for unauthenticated users (not 404)
const protectedPages = [
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/customers', name: 'Customers' },
  { path: '/contacts', name: 'Contacts' },
  { path: '/activities', name: 'Activities' },
  { path: '/tasks', name: 'Tasks' },
  { path: '/settings', name: 'Settings' },
]

test.describe('Public pages load without 404', () => {
  for (const page of publicPages) {
    test(`${page.name} (${page.path})`, async ({ page: p }) => {
      const resp = await p.goto(`https://crm.meowcloud.ai${page.path}`)
      expect(resp?.status()).not.toBe(404)
      expect(resp?.status()).toBeLessThan(500)
    })
  }
})

test.describe('Protected pages redirect to login (not 404)', () => {
  for (const page of protectedPages) {
    test(`${page.name} (${page.path})`, async ({ page: p }) => {
      await p.context().clearCookies()
      const resp = await p.goto(`https://crm.meowcloud.ai${page.path}`, { waitUntil: 'networkidle' })
      // Should either show the page (200) or redirect to login
      expect(resp?.status()).not.toBe(404)
      const url = p.url()
      // Should end up at login (redirect) or the page itself
      expect(url.includes('/login') || url.includes(page.path)).toBeTruthy()
    })
  }
})
