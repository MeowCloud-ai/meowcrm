import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '忘記密碼',
  description: '重設你的 MeowCRM 密碼。',
}

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
