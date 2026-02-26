import { test, expect } from '@playwright/test'

// 用 Supabase API 直接建測試帳號 + 登入拿 session
const SUPABASE_URL = 'https://euycsevjwwisgtbmemsx.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

test.describe('CRUD Full Test', () => {
  
  test.beforeEach(async ({ page }) => {
    // 用 email/password 註冊或登入測試帳號
    await page.goto('https://crm.meowcloud.ai/signup', { waitUntil: 'networkidle' })
    
    // 先試登入（帳號可能已存在）
    await page.goto('https://crm.meowcloud.ai/login', { waitUntil: 'networkidle' })
    await page.fill('input[type="email"]', 'test-crud@meowcloud.ai')
    await page.fill('input[type="password"]', 'TestCrud2026!')
    await page.click('button[type="submit"]')
    
    // 等導航完成
    await page.waitForTimeout(3000)
    
    // 如果還在 login（帳號不存在），去註冊
    if (page.url().includes('/login')) {
      await page.goto('https://crm.meowcloud.ai/signup', { waitUntil: 'networkidle' })
      await page.fill('input[type="email"]', 'test-crud@meowcloud.ai')
      await page.fill('input[type="password"]', 'TestCrud2026!')
      await page.click('button[type="submit"]')
      await page.waitForTimeout(3000)
      
      // 可能需要確認信，如果 redirect 到 dashboard 就成功
      if (!page.url().includes('/dashboard')) {
        console.log('Signup may need email confirmation, trying login again...')
        await page.goto('https://crm.meowcloud.ai/login', { waitUntil: 'networkidle' })
        await page.fill('input[type="email"]', 'test-crud@meowcloud.ai')
        await page.fill('input[type="password"]', 'TestCrud2026!')
        await page.click('button[type="submit"]')
        await page.waitForTimeout(3000)
      }
    }
    
    console.log('Current URL after auth:', page.url())
  })

  test('Dashboard loads', async ({ page }) => {
    await page.goto('https://crm.meowcloud.ai/dashboard', { waitUntil: 'networkidle' })
    await page.screenshot({ path: '/tmp/crud-dashboard.png', fullPage: true })
    console.log('Dashboard URL:', page.url())
  })

  test('Create 3 customers', async ({ page }) => {
    const customers = [
      { name: '測試科技有限公司', industry: '資訊科技', status: 'active' },
      { name: '幸福餐飲集團', industry: '餐飲', status: 'lead' },
      { name: '創新金融顧問', industry: '金融', status: 'active' },
    ]

    for (const c of customers) {
      await page.goto('https://crm.meowcloud.ai/customers/new', { waitUntil: 'networkidle' })
      await page.screenshot({ path: `/tmp/crud-customer-new-${c.name}.png`, fullPage: true })
      console.log('New customer page URL:', page.url())
      
      // Fill form
      const nameInput = page.locator('input[name="name"], input[placeholder*="客戶"], input[placeholder*="名稱"]').first()
      if (await nameInput.isVisible()) {
        await nameInput.fill(c.name)
      }
      
      // Try to find and fill industry
      const industryInput = page.locator('input[name="industry"], input[placeholder*="產業"]').first()
      if (await industryInput.isVisible().catch(() => false)) {
        await industryInput.fill(c.industry)
      }
      
      // Submit
      const submitBtn = page.locator('button[type="submit"], button:has-text("儲存"), button:has-text("建立"), button:has-text("新增")').first()
      if (await submitBtn.isVisible()) {
        await submitBtn.click()
        await page.waitForTimeout(2000)
      }
      
      console.log(`Created customer: ${c.name}, URL: ${page.url()}`)
      await page.screenshot({ path: `/tmp/crud-customer-after-${c.name}.png`, fullPage: true })
    }

    // Verify customer list
    await page.goto('https://crm.meowcloud.ai/customers', { waitUntil: 'networkidle' })
    await page.screenshot({ path: '/tmp/crud-customers-list.png', fullPage: true })
  })

  test('Create tasks', async ({ page }) => {
    await page.goto('https://crm.meowcloud.ai/tasks', { waitUntil: 'networkidle' })
    await page.screenshot({ path: '/tmp/crud-tasks.png', fullPage: true })
    console.log('Tasks page URL:', page.url())
    
    // Look for add task button
    const addBtn = page.locator('button:has-text("新增"), button:has-text("建立"), button:has-text("任務")').first()
    if (await addBtn.isVisible().catch(() => false)) {
      console.log('Found add task button')
      await addBtn.click()
      await page.waitForTimeout(1000)
      await page.screenshot({ path: '/tmp/crud-task-form.png', fullPage: true })
    } else {
      console.log('No add task button found on tasks page')
    }
  })

  test('Check all sidebar pages', async ({ page }) => {
    const pages = ['/dashboard', '/customers', '/contacts', '/activities', '/tasks', '/settings']
    for (const p of pages) {
      await page.goto(`https://crm.meowcloud.ai${p}`, { waitUntil: 'networkidle' })
      const title = await page.title()
      console.log(`${p} → ${page.url()} (title: ${title})`)
      await page.screenshot({ path: `/tmp/crud-page-${p.replace(/\//g, '_')}.png`, fullPage: true })
    }
  })
})
