# MeowCRM Changelog

## [0.1.0] - 2026-02-26 (Sprint 7: SDLC 還債)
### Added
- Vitest + 23 unit tests（af178a8）
- Playwright + 9 E2E tests（6d7e8c1, 5930625）
- CI pipeline: pnpm + typecheck + test + build（9c3d121）

### Fixed
- CI 從 npm 遷移到 pnpm（9c3d121）
- vitest/globals 型別設定（50e6af4）
- 排除 e2e 從 vitest + gitignore playwright artifacts（7475941）

## [0.0.6] - 2026-02-26 (Sprint 6: 品牌設計)
### Added
- Aurora 漸層簽名線（41ab7ff）
- 藥丸型按鈕 rounded-full（7a49b3b）
- Dashboard 品牌化標題與漸層圖示（f1f0074）
- Dark mode toggle with localStorage persistence（7640056）
- 品牌色彩一致性 across customer pages（3155bf1）
- 忘記密碼 / 重設密碼流程（498be3b）

## [0.0.5] - 2026-02-22 (Sprint 5: Design System 整合)
### Added
- MeowCloud Design System tokens（559f773）
- DM Sans + JetBrains Mono 字體
- Brand color variables (light + dark)
- 全頁面套用 Design System v1.0（26097e5）

## [0.0.4] - Sprint 4: Dashboard + 設定
### Added
- T17: 設定頁面 — 組織資訊、成員列表、個人設定（ab8c006）
- T16: Landing Page（01d7daf）
- T15: Dashboard 總覽 — 統計卡片、近期活動、歡迎訊息（3426561）

## [0.0.3] - Sprint 3: 任務管理
### Added
- T14: 任務到期提醒（頁面內 Alert）（5b09d19）
- T13: 任務 CRUD + 關聯客戶（9bedf76）
- T12: 任務看板 Kanban Board（3a46900）

## [0.0.2] - Sprint 2: 互動與聯絡人
### Added
- T11: 互動紀錄改為時間軸顯示（227fe28）
- T10: 互動日誌列表 + 手動新增（52402ee）
- T9: 聯絡人 CRUD — 新增/編輯/刪除（dd0fed4）
- T8: 客戶詳情頁 — 基本資訊 + Tab 切換 + soft delete（6971c14）

## [0.0.1] - Sprint 1: 專案初始化
### Added
- T7: 客戶新增/編輯表單（18272e8）
- T6: 客戶列表頁 — 搜尋 + 篩選 + 分頁（c73c7da）
- 專案初始化 + 認證系統 + 基礎 Layout（6397d98）
- Phase 1 設計文件 — ARCHITECTURE + TASKS + CLAUDE + DECISIONS（674375a）
- MeowCRM PRD v0.1（eb66d28）

### Fixed
- 三腦會議 Review 修正 — 安全漏洞 + RLS 效能 + 定價調整（d37b962）
