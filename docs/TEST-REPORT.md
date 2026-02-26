# MeowCRM 測試報告

## 最近執行: 2026-02-26

### Unit Tests (Vitest)
| 檔案 | 測試數 | 狀態 |
|------|--------|------|
| src/__tests__/dashboard-stats.test.tsx | 3 | ✅ passed |
| src/__tests__/app-header.test.tsx | 3 | ✅ passed |
| src/__tests__/customer-list.test.tsx | 3 | ✅ passed |
| src/__tests__/button.test.tsx | 6 | ✅ passed |
| src/__tests__/meowcloud-logo.test.tsx | 4 | ✅ passed |
| src/__tests__/use-theme.test.ts | 4 | ✅ passed |

**總計: 23 passed / 23 total**

### E2E Tests (Playwright)
- 9 tests passed（3 spec files × 3 browsers: Chromium）
- landing.spec.ts: 3 passed
- auth.spec.ts: 3 passed
- navigation.spec.ts: 3 passed

### 已知問題
- E2E 需要真實 Supabase 連線才能測試登入後功能
- app-header.test.tsx 有 `act(...)` console warning（不影響測試結果）
