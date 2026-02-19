# MeowCRM — 技術架構

> **版本：** v0.1 | **日期：** 2026-02-19

## 系統概覽

```
┌──────────────────────────────────────────────────┐
│                    Client (Browser)                │
│                   Next.js App Router                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ Dashboard │ │ Customer │ │  Tasks   │          │
│  │   Page   │ │  Detail  │ │  Board   │          │
│  └──────────┘ └──────────┘ └──────────┘          │
└──────────────────┬───────────────────────────────┘
                   │ Supabase Client SDK
┌──────────────────▼───────────────────────────────┐
│              Supabase (BaaS)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │   Auth   │ │ Postgres │ │ Realtime │          │
│  │ (OAuth)  │ │  + RLS   │ │   Sub    │          │
│  └──────────┘ └──────────┘ └──────────┘          │
└──────────────────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────┐
│          MeowMeet Integration (Future)             │
│  Webhook / API → 智慧歸檔數據 → CRM 寫入          │
└──────────────────────────────────────────────────┘
```

## 技術選型

| 層級 | 選擇 | 理由 |
|------|------|------|
| 前端框架 | **Next.js 15 (App Router)** | SSR + RSC、SEO、TypeScript 原生 |
| UI 元件 | **shadcn/ui + Tailwind CSS** | 快速開發、美觀、可客製 |
| 後端 / DB | **Supabase (PostgreSQL)** | Auth + DB + Realtime 一站式、免自建後端 |
| ORM | **Supabase Client SDK** | 直接用 SDK，不需額外 ORM |
| 部署 | **Vercel** | Next.js 原生支援、Preview Deploy |
| 狀態管理 | **React Server Components + URL State** | 盡量不用 client state |
| 表單 | **React Hook Form + Zod** | 型別安全驗證 |

## 資料庫設計

### ER 圖

```
Organization (租戶)
 ├── org_members (使用者 ↔ 組織)
 │     └── User (Supabase Auth)
 │
 ├── Customer (客戶/公司)
 │     ├── Contact (聯絡人)
 │     ├── Deal (商機) → v0.2
 │     ├── Task (任務)
 │     └── Activity (互動日誌)
 │           └── meeting_ref → MeowMeet ID (外部連結)
 │
 └── Settings (組織設定)
```

### 核心資料表

```sql
-- 組織（多租戶）
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ  -- soft delete
);

-- 組織成員
CREATE TABLE org_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(org_id, user_id)
);

-- 客戶（公司）
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  industry TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'lead')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ  -- soft delete
);

-- 索引
CREATE INDEX idx_customers_org ON customers(org_id);
CREATE INDEX idx_contacts_org ON contacts(org_id);
CREATE INDEX idx_contacts_customer ON contacts(customer_id);
CREATE INDEX idx_tasks_org ON tasks(org_id);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_tasks_customer ON tasks(customer_id);
CREATE INDEX idx_activities_org ON activities(org_id);
CREATE INDEX idx_activities_customer ON activities(customer_id);

-- 聯絡人
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,         -- 職稱
  email TEXT,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 任務
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  due_date DATE,
  notes TEXT,
  source TEXT, -- 'manual' | 'meowmeet'
  meeting_ref TEXT, -- MeowMeet meeting ID
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 互動日誌
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- 'meeting' | 'call' | 'email' | 'visit' | 'note'
  summary TEXT,
  details TEXT,       -- 完整內容 / 逐字稿連結
  meeting_ref TEXT,   -- MeowMeet meeting ID
  occurred_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Row Level Security（RLS）

所有資料表啟用 RLS，確保租戶隔離：

```sql
-- 範例：customers
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- ⚠️ 高效模式：從 JWT claims 讀取 org_id，不做子查詢
-- 登入時透過 Supabase Auth Hook 將 org_id 寫入 JWT app_metadata

CREATE POLICY "users can view own org customers"
  ON customers FOR SELECT
  USING (
    org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::UUID
    AND deleted_at IS NULL  -- soft delete 過濾
  );

CREATE POLICY "users can insert own org customers"
  ON customers FOR INSERT
  WITH CHECK (
    org_id = (auth.jwt() -> 'app_metadata' ->> 'org_id')::UUID
  );

-- 其他表同理，皆從 JWT claims 讀取 org_id
```

## 頁面結構

```
/                          → Landing Page (公開)
/login                     → 登入 / 註冊
/dashboard                 → 總覽（客戶數、任務數、近期活動）
/customers                 → 客戶列表
/customers/[id]            → 客戶詳情（聯絡人 + 互動時間軸 + 任務）
/contacts                  → 聯絡人列表
/tasks                     → 任務看板（待辦 / 進行中 / 完成）
/activities                → 互動日誌時間軸
/settings                  → 組織設定、成員管理
```

## MeowMeet 整合方案（v0.2）

```
MeowMeet (Electron App)
    │
    │ 會議結束 → Gemini 摘要 → NER 實體辨識
    │
    ▼
智慧歸檔卡片（MeowMeet 端 UI）
    │
    │ 用戶確認/修正（Human-in-the-loop）→ 一鍵同步
    │
    ▼
Supabase Edge Function（驗證 API Key + 用戶身份）
    │
    ├── upsert customers (模糊比對 + 去重建議)
    ├── upsert contacts (比對姓名+公司+Email)
    ├── insert activities (type: 'meeting')
    ├── insert tasks (from action items)
    └── 記錄 NER 修正數據（用於模型優化）
```

**⚠️ 安全決策（三腦會議 Review）：** MeowMeet（Electron）**絕不能**直接使用 Supabase Client SDK 或嵌入金鑰。Electron 應用可被反編譯，金鑰會外洩。**必須透過 Supabase Edge Function 中介**，以獨立 API Key + 用戶 JWT 驗證請求合法性。

## 非功能需求實現

| 需求 | 實現方式 |
|------|----------|
| 效能 | Next.js RSC + Streaming、Supabase Edge Functions |
| 安全 | Supabase Auth + RLS + HTTPS |
| 個資合規 | 隱私政策頁面、數據使用同意 checkbox |
| 備份 | Supabase 自動每日備份 |
| 監控 | Vercel Analytics + Supabase Dashboard |
