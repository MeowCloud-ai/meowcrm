# MeowCRM — 任務拆解

> **版本：** v0.1 | **日期：** 2026-02-19

## Sprint 1: 基礎建設 + Auth

| Task | 標題 | 複雜度 | 對應 Issue |
|------|------|--------|-----------|
| T1 | 專案初始化（Next.js + Supabase + shadcn/ui） | S | #1 |
| T2 | Supabase 資料庫 Schema + RLS 設定 | M | #2 |
| T3 | 認證系統（Email + Google OAuth 登入/註冊） | M | #3 |
| T4 | 組織建立 + 成員邀請基礎 | S | #4 |
| T5 | 基礎 Layout（Sidebar + Header + 路由） | S | #5 |

## Sprint 2: 客戶管理

| Task | 標題 | 複雜度 | 對應 Issue |
|------|------|--------|-----------|
| T6 | 客戶列表頁（搜尋 + 篩選 + 分頁） | M | #6 |
| T7 | 新增/編輯客戶表單 | S | #7 |
| T8 | 客戶詳情頁（基本資訊 + Tab 切換） | M | #8 |

## Sprint 3: 聯絡人 + 互動日誌

| Task | 標題 | 複雜度 | 對應 Issue |
|------|------|--------|-----------|
| T9 | 聯絡人 CRUD（掛在客戶底下） | M | #9 |
| T10 | 互動日誌列表 + 新增（手動） | M | #10 |
| T11 | 客戶詳情：互動時間軸顯示 | S | #11 |

## Sprint 4: 任務管理

| Task | 標題 | 複雜度 | 對應 Issue |
|------|------|--------|-----------|
| T12 | 任務看板（Kanban：待辦/進行中/完成） | L | #12 |
| T13 | 任務 CRUD + 關聯客戶 | M | #13 |
| T14 | 任務到期提醒（Email via Supabase Edge Function） | M | #14 |

## Sprint 5: Dashboard + 收尾

| Task | 標題 | 複雜度 | 對應 Issue |
|------|------|--------|-----------|
| T15 | Dashboard 總覽（客戶數、任務數、近期活動） | M | #15 |
| T16 | Landing Page（公開頁面、產品介紹） | M | #16 |
| T17 | 設定頁面（組織資訊、成員管理） | S | #17 |
| T18 | 部署到 Production（Vercel + Supabase） | S | #18 |

## Sprint 6: 認證優化 + 體驗改善

| Task | 標題 | 複雜度 | 對應 Issue |
|------|------|--------|-----------|
| T19 | Google OAuth 登入整合 | M | — |

> **T19 說明：** Supabase 免費版確認信不穩定，改用 Google OAuth 作為主要登入方式。需在 Supabase Dashboard 設定 Google Provider + GCP OAuth Client。

## 未來 Sprint（v0.2）

| Task | 標題 | 說明 |
|------|------|------|
| T19 | 商機管理 Kanban | 接觸→提案→報價→成交/失敗 |
| T20 | MeowMeet 智慧歸檔整合 | NER + 一鍵同步 |
| T21 | CSV 匯入/匯出 | 批量客戶資料操作 |
| T22 | 簡易報表 | 成交率、互動頻率 |

## 複雜度定義

- **S (Small):** < 4 小時，單一模組
- **M (Medium):** 4-8 小時，跨模組或有外部整合
- **L (Large):** 8-16 小時，核心功能或大量 UI
