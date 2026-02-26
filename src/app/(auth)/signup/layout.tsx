import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '註冊',
  description: '免費註冊 MeowCRM，開始管理你的客戶關係。',
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
