import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '重設密碼',
  description: '設定你的 MeowCRM 新密碼。',
}

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
