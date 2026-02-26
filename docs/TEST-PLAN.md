# MeowCRM 測試計劃

## 測試策略
- **Unit Tests**: Vitest + React Testing Library，覆蓋 hooks、元件 render、utility
- **E2E Tests**: Playwright + Chromium，覆蓋核心使用者流程
- **CI 整合**: GitHub Actions 每次 PR 自動跑 lint + typecheck + unit tests

## 覆蓋率目標
- Unit: ≥ 80% 核心元件
- E2E: 所有主要使用者 flow

## 測試環境
- Unit: jsdom (vitest)
- E2E: Chromium headless，dev server localhost:3000
- CI: Ubuntu latest, Node 20, pnpm 9

## 測試範圍
| 類型 | 範圍 | 檔案 |
|------|------|------|
| Unit | use-theme hook | src/__tests__/use-theme.test.ts |
| Unit | DashboardStats 元件 | src/__tests__/dashboard-stats.test.tsx |
| Unit | MeowCloudLogo | src/__tests__/meowcloud-logo.test.tsx |
| Unit | CustomerList | src/__tests__/customer-list.test.tsx |
| Unit | AppHeader | src/__tests__/app-header.test.tsx |
| Unit | Button variants | src/__tests__/button.test.tsx |
| E2E | Landing page | e2e/landing.spec.ts |
| E2E | Auth pages | e2e/auth.spec.ts |
| E2E | Navigation/redirect | e2e/navigation.spec.ts |
