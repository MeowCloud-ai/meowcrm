import { test, expect } from '@playwright/test'

test.describe.serial('CRUD 完整建檔測試', () => {

  // 共用登入狀態
  test.beforeEach(async ({ page }) => {
    await page.goto('https://crm.meowcloud.ai/login', { waitUntil: 'networkidle' })
    await page.fill('input[type="email"]', 'test-crud@meowcloud.ai')
    await page.fill('input[type="password"]', 'TestCrud2026!')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/dashboard', { timeout: 10000 })
  })

  test('建立3筆客戶', async ({ page }) => {
    const customers = [
      { name: '測試科技有限公司', industry: '資訊科技' },
      { name: '幸福餐飲集團', industry: '餐飲' },
      { name: '創新金融顧問', industry: '金融' },
    ]

    for (const c of customers) {
      await page.goto('https://crm.meowcloud.ai/customers/new', { waitUntil: 'networkidle' })
      
      // 用 placeholder 精準定位
      await page.fill('input[placeholder="請輸入公司名稱"]', c.name)
      await page.fill('input[placeholder*="科技、金融"]', c.industry)
      
      // 點新增客戶按鈕
      await page.click('button:has-text("新增客戶")')
      await page.waitForTimeout(3000)
      
      // 截圖看結果
      await page.screenshot({ path: `/tmp/crud-create-${c.name}.png`, fullPage: true })
      console.log(`After creating "${c.name}": ${page.url()}`)
      
      // 檢查是否有錯誤訊息
      const error = page.locator('.bg-destructive\\/15, [class*="destructive"]')
      if (await error.isVisible().catch(() => false)) {
        const errorText = await error.textContent()
        console.log(`❌ Error: ${errorText}`)
      }
    }

    // 驗證列表
    await page.goto('https://crm.meowcloud.ai/customers', { waitUntil: 'networkidle' })
    await page.screenshot({ path: '/tmp/crud-customer-list-final.png', fullPage: true })
    const html = await page.content()
    for (const c of customers) {
      const found = html.includes(c.name)
      console.log(`${found ? '✅' : '❌'} "${c.name}" in customer list: ${found}`)
    }
  })

  test('進入客戶詳情 + 建立3筆聯絡人', async ({ page }) => {
    await page.goto('https://crm.meowcloud.ai/customers', { waitUntil: 'networkidle' })
    
    // 點第一個客戶進詳情
    const customerLink = page.locator('a[href*="/customers/"]').first()
    if (await customerLink.isVisible()) {
      await customerLink.click()
      await page.waitForTimeout(2000)
      await page.screenshot({ path: '/tmp/crud-customer-detail.png', fullPage: true })
      console.log('Customer detail:', page.url())
      
      // 切到聯絡人 tab
      const contactTab = page.locator('button:has-text("聯絡人"), [data-value="contacts"]')
      if (await contactTab.isVisible().catch(() => false)) {
        await contactTab.click()
        await page.waitForTimeout(1000)
      }
      
      const contacts = [
        { name: '王小明', title: '技術長', email: 'ming@test.com', phone: '0912345678' },
        { name: '李小華', title: '業務經理', email: 'hua@test.com', phone: '0923456789' },
        { name: '張大衛', title: '專案經理', email: 'david@test.com', phone: '0934567890' },
      ]

      for (const contact of contacts) {
        // 找新增聯絡人按鈕
        const addBtn = page.locator('button:has-text("新增聯絡人"), button:has-text("新增")')
        if (await addBtn.first().isVisible().catch(() => false)) {
          await addBtn.first().click()
          await page.waitForTimeout(1000)
          await page.screenshot({ path: `/tmp/crud-contact-form-${contact.name}.png`, fullPage: true })
          
          // 填表單（可能是 dialog）
          const nameInput = page.locator('input[placeholder*="姓名"], input[name="name"]').last()
          if (await nameInput.isVisible().catch(() => false)) {
            await nameInput.fill(contact.name)
          }
          const titleInput = page.locator('input[placeholder*="職稱"], input[name="title"]').last()
          if (await titleInput.isVisible().catch(() => false)) {
            await titleInput.fill(contact.title)
          }
          const emailInput = page.locator('input[placeholder*="email"], input[name="email"], input[type="email"]').last()
          if (await emailInput.isVisible().catch(() => false)) {
            await emailInput.fill(contact.email)
          }
          const phoneInput = page.locator('input[placeholder*="電話"], input[name="phone"]').last()
          if (await phoneInput.isVisible().catch(() => false)) {
            await phoneInput.fill(contact.phone)
          }
          
          // 送出
          const submitBtn = page.locator('button:has-text("儲存"), button:has-text("新增"), button[type="submit"]').last()
          if (await submitBtn.isVisible().catch(() => false)) {
            await submitBtn.click()
            await page.waitForTimeout(2000)
          }
          console.log(`Contact "${contact.name}" submitted`)
        }
      }
      await page.screenshot({ path: '/tmp/crud-contacts-done.png', fullPage: true })
    }
  })

  test('建立3筆任務', async ({ page }) => {
    await page.goto('https://crm.meowcloud.ai/tasks', { waitUntil: 'networkidle' })
    await page.screenshot({ path: '/tmp/crud-tasks-page.png', fullPage: true })
    
    const tasks = [
      { title: '準備提案簡報', status: 'todo' },
      { title: '寄報價單給客戶', status: 'todo' },
      { title: '安排下週會議', status: 'in_progress' },
    ]

    for (const t of tasks) {
      const addBtn = page.locator('button:has-text("新增")')
      if (await addBtn.first().isVisible().catch(() => false)) {
        await addBtn.first().click()
        await page.waitForTimeout(1000)
        await page.screenshot({ path: `/tmp/crud-task-form-${t.title}.png`, fullPage: true })
        
        const titleInput = page.locator('input[placeholder*="標題"], input[placeholder*="任務"], input[name="title"]').last()
        if (await titleInput.isVisible().catch(() => false)) {
          await titleInput.fill(t.title)
        }
        
        const submitBtn = page.locator('button:has-text("儲存"), button:has-text("新增"), button[type="submit"]').last()
        if (await submitBtn.isVisible().catch(() => false)) {
          await submitBtn.click()
          await page.waitForTimeout(2000)
        }
        console.log(`Task "${t.title}" submitted`)
      }
    }
    await page.screenshot({ path: '/tmp/crud-tasks-done.png', fullPage: true })
  })

  test('建立3筆活動紀錄', async ({ page }) => {
    // 活動是在客戶詳情頁建立的
    await page.goto('https://crm.meowcloud.ai/customers', { waitUntil: 'networkidle' })
    const customerLink = page.locator('a[href*="/customers/"]').first()
    if (await customerLink.isVisible()) {
      await customerLink.click()
      await page.waitForTimeout(2000)
      
      // 切到活動 tab
      const activityTab = page.locator('button:has-text("活動"), [data-value="activities"]')
      if (await activityTab.isVisible().catch(() => false)) {
        await activityTab.click()
        await page.waitForTimeout(1000)
      }

      const activities = [
        { type: 'meeting', summary: '初次拜訪討論合作' },
        { type: 'call', summary: '電話確認需求' },
        { type: 'email', summary: '寄送產品規格書' },
      ]

      for (const a of activities) {
        const addBtn = page.locator('button:has-text("新增活動"), button:has-text("新增互動"), button:has-text("新增")')
        if (await addBtn.first().isVisible().catch(() => false)) {
          await addBtn.first().click()
          await page.waitForTimeout(1000)
          await page.screenshot({ path: `/tmp/crud-activity-form-${a.summary}.png`, fullPage: true })
          
          const summaryInput = page.locator('input[placeholder*="摘要"], textarea[placeholder*="摘要"], input[name="summary"], textarea[name="summary"]').last()
          if (await summaryInput.isVisible().catch(() => false)) {
            await summaryInput.fill(a.summary)
          }
          
          const submitBtn = page.locator('button:has-text("儲存"), button:has-text("新增"), button[type="submit"]').last()
          if (await submitBtn.isVisible().catch(() => false)) {
            await submitBtn.click()
            await page.waitForTimeout(2000)
          }
          console.log(`Activity "${a.summary}" submitted`)
        }
      }
      await page.screenshot({ path: '/tmp/crud-activities-done.png', fullPage: true })
    }
  })
})
