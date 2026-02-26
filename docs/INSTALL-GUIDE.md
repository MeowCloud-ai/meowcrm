# MeowCRM 開發環境安裝指南

## 環境需求
- Node.js ≥ 20
- pnpm ≥ 9
- Git

## 安裝步驟

### 1. Clone repo
```bash
git clone https://github.com/MeowCloud-ai/meowcrm.git
cd meowcrm
```

### 2. 安裝依賴
```bash
pnpm install
```

### 3. 環境變數
複製 `.env.example`（如果有）或建立 `.env.local`：
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. 啟動開發伺服器
```bash
pnpm dev
# 開啟 http://localhost:3000
```

### 5. 跑測試
```bash
pnpm test          # Unit tests
pnpm test:e2e      # E2E tests (需要 Chromium)
```

### 6. Type Check + Lint
```bash
pnpm typecheck
pnpm lint
```

## 部署
- Push to main → Vercel 自動部署
- Preview: PR 會自動產生 Preview URL
