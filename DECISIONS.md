# DECISIONS.md — 架構決策紀錄

## ADR-001: 使用 Supabase 而非自建後端
- **日期:** 2026-02-19
- **狀態:** 已採用
- **決定:** 使用 Supabase 作為 BaaS，不另建 REST API
- **原因:** 極低開發成本、內建 Auth + RLS + Realtime；MeowCRM 定位為免費/低價產品，必須壓低開發和維運成本
- **風險:** 複雜查詢能力受限，未來可能需要 Edge Functions 補充

## ADR-002: 極簡功能策略
- **日期:** 2026-02-19
- **狀態:** 已採用
- **決定:** MVP 只做客戶、聯絡人、任務、互動日誌四個模組，不做行銷自動化、複雜報表、自訂欄位
- **原因:** MeowCRM 的目的是數據收集而非功能競爭。功能越少 → 上手越快 → 用戶留存越高
- **風險:** 進階用戶可能覺得太陽春，但這不是我們的 ICP

## ADR-003: 多租戶用 organizations 表
- **日期:** 2026-02-19
- **狀態:** 已採用
- **決定:** 用 `organizations` + `org_members` 實現多租戶，所有資料表帶 `org_id`，RLS 以 org 為邊界
- **原因:** 簡單直觀、Supabase RLS 原生支援、未來可擴展為團隊功能

## ADR-004: MeowMeet 整合用同一個 Supabase 專案
- **日期:** 2026-02-19
- **狀態:** 已採用
- **決定:** MeowMeet (Electron) 和 MeowCRM (Web) 共用同一個 Supabase 專案，MeowMeet 直接用 Supabase SDK 寫入 CRM 資料
- **原因:** 零延遲、零額外 API 成本、簡化架構
- **風險:** 兩個產品的 DB migration 需要協調
