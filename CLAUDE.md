# CLAUDE.md — MeowCRM 開發指引

## 專案概覽
MeowCRM 是一個極簡 CRM 系統，定位為「自動導航 CRM」。核心價值是與 MeowMeet 整合，讓會議數據自動流入客戶管理。

## 技術棧
- **框架:** Next.js 15 (App Router, TypeScript)
- **UI:** shadcn/ui + Tailwind CSS
- **後端:** Supabase (PostgreSQL + Auth + Realtime)
- **部署:** Vercel
- **表單:** React Hook Form + Zod
- **套件管理:** pnpm

## 開發規範

### 目錄結構
```
src/
├── app/                  # Next.js App Router 頁面
│   ├── (auth)/           # 認證相關頁面
│   ├── (dashboard)/      # 登入後頁面
│   └── layout.tsx
├── components/
│   ├── ui/               # shadcn/ui 元件
│   └── ...               # 業務元件
├── lib/
│   ├── supabase/         # Supabase client + types
│   └── utils.ts
└── types/
    └── database.ts       # Supabase generated types
```

### 編碼風格
- 使用 Server Components 優先，只在需要互動時用 Client Components
- 所有資料庫操作透過 Supabase Client SDK（不另建 API Route）
- 表單驗證用 Zod schema
- 繁體中文 UI（所有面向用戶的文字）
- 命名：kebab-case 檔案、PascalCase 元件、camelCase 函式

### 安全
- 所有資料表啟用 RLS
- 永遠不要在 client 端暴露 service_role key
- 用 Supabase Auth 的 user id 做權限判斷

### Git 規範
- Branch: `feat/task-N-description` 或 `fix/issue-N-description`
- Commit: `feat:`, `fix:`, `docs:`, `chore:`, `style:`, `refactor:`
- PR 必須關聯 Issue: `Closes #N`

## 文件參考
- PRD: `docs/PRD.md`
- 架構: `docs/ARCHITECTURE.md`
- 任務: `docs/TASKS.md`
