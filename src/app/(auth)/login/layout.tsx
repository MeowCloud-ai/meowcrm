import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '登入',
  description: '登入 MeowCRM，管理你的客戶關係。',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
