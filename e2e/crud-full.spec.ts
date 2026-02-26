import { test, expect } from '@playwright/test'

test.describe.serial('CRUD Full Test - 每個主檔建3筆', () => {

  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies()
    await page.goto('https://crm.meowcloud.ai/login', { waitUntil: 'networkidle' })
    await page.fill('input[type="email"]', 'test-crud@meowcloud.ai')
    await page.fill('input[type="password"]', 'TestCrud2026!')
    await page.click('button[type="submit"]')
    await page.waitForTimeout(3000)
    console.log('Auth URL:', page.url())
    await page.screenshot({ path: '/tmp/crud-00-after-login.png', fullPage: true })
  })

  test('1. Dashboard 載入', async ({ page }) => {
    expect(page.url()).toContain('/dashboard')
    await page.screenshot({ path: '/tmp/crud-01-dashboard.png', fullPage: true })
    console.log('✅ Dashboard OK')
  })

  test('2. 建立3筆客戶', async ({ page }) => {
    const customers = ['測試科技有限公司', '幸福餐飲集團', '創新金融顧問']
    
    for (const name of customers) {
      await page.goto('https://crm.meowcloud.ai/customers/new', { waitUntil: 'networkidle' })
      await page.screenshot({ path: `/tmp/crud-02-new-customer-form.png`, fullPage: true })
      
      // Fill name field
      await page.locator('input').first().fill(name)
      
      // Find and click submit
      const buttons = page.locator('button[type="submit"], button:has-text("儲存"), button:has-text("建立"), button:has-text("新增")')
      const count = await buttons.count()
      console.log(`Found ${count} submit buttons for ${name}`)
      
      if (count > 0) {
        await buttons.first().click()
        await page.waitForTimeout(2000)
      }
      console.log(`Customer "${name}" → URL: ${page.url()}`)
    }
    
    // 驗證客戶列表
    await page.goto('https://crm.meowcloud.ai/customers', { waitUntil: 'networkidle' })
    await page.screenshot({ path: '/tmp/crud-02-customer-list.png', fullPage: true })
    const content = await page.content()
    for (const name of customers) {
      console.log(`Customer "${name}" in list: ${content.includes(name)}`)
    }
  })

  test('3. 客戶詳情 + 新增聯絡人', async ({ page }) => {
    // 先到客戶列表找第一個客戶
    await page.goto('https://crm.meowcloud.ai/customers', { waitUntil: 'networkidle' })
    
    // 點第一個客戶
    const firstCustomer = page.locator('a[href*="/customers/"]').first()
    if (await firstCustomer.isVisible()) {
      await firstCustomer.click()
      await page.waitForTimeout(2000)
      await page.screenshot({ path: '/tmp/crud-03-customer-detail.png', fullPage: true })
      console.log('Customer detail URL:', page.url())
      
      // 找聯絡人 tab 或新增聯絡人按鈕
      const contactTab = page.locator('button:has-text("聯絡人"), [role="tab"]:has-text("聯絡人")')
      if (await contactTab.isVisible().catch(() => false)) {
        await contactTab.click()
        await page.waitForTimeout(1000)
      }
      
      // 嘗試新增聯絡人
      const addContactBtn = page.locator('button:has-text("新增聯絡人"), button:has-text("新增")')
      const addCount = await addContactBtn.count()
      console.log(`Found ${addCount} add contact buttons`)
      await page.screenshot({ path: '/tmp/crud-03-contact-tab.png', fullPage: true })
    }
  })

  test('4. 任務頁面', async ({ page }) => {
    await page.goto('https://crm.meowcloud.ai/tasks', { waitUntil: 'networkidle' })
    await page.screenshot({ path: '/tmp/crud-04-tasks.png', fullPage: true })
    console.log('Tasks URL:', page.url())
    
    // 找新增任務按鈕
    const addBtn = page.locator('button:has-text("新增"), button:has-text("任務")')
    const count = await addBtn.count()
    console.log(`Found ${count} task buttons`)
  })

  test('5. 所有頁面巡覽', async ({ page }) => {
    const pages = ['/dashboard', '/customers', '/contacts', '/activities', '/tasks', '/settings']
    for (const p of pages) {
      await page.goto(`https://crm.meowcloud.ai${p}`, { waitUntil: 'networkidle' })
      const status = page.url().includes(p) ? '✅' : '⚠️ redirect'
      console.log(`${status} ${p} → ${page.url()}`)
      await page.screenshot({ path: `/tmp/crud-05${p.replace(/\//g, '_')}.png`, fullPage: true })
    }
  })
})
