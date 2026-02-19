# 🐱 MeowCRM

自動導航 CRM 系統，與 MeowMeet 整合讓會議數據自動流入客戶管理。

## 技術棧

- **Next.js 15** (App Router) + TypeScript
- **shadcn/ui** + Tailwind CSS
- **Supabase** (PostgreSQL + Auth + Realtime)
- **pnpm**

## 開始使用

```bash
# 安裝依賴
pnpm install

# 設定環境變數
cp .env.example .env.local
# 編輯 .env.local 填入 Supabase URL 和 Anon Key

# 執行資料庫遷移
# 在 Supabase Dashboard SQL Editor 中執行 supabase/migrations/20260219_001_initial_schema.sql

# 啟動開發伺服器
pnpm dev
```

## 專案結構

```
src/
├── app/
│   ├── (auth)/          # 認證頁面 (登入/註冊)
│   ├── (dashboard)/     # 儀表板頁面
│   └── layout.tsx       # 根 Layout
├── components/
│   ├── ui/              # shadcn/ui 元件
│   ├── app-sidebar.tsx  # 側邊欄
│   └── app-header.tsx   # 頂部標題列
├── lib/
│   ├── supabase/        # Supabase 客戶端
│   ├── hooks/           # React hooks
│   └── utils.ts         # 工具函式
└── types/               # TypeScript 型別定義
```

## 文件

- [PRD](docs/PRD.md)
- [架構設計](docs/ARCHITECTURE.md)
- [任務規劃](docs/TASKS.md)
