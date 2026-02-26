import type { Metadata } from "next"
import { DM_Sans, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://crm.meowcloud.ai'),
  title: { default: 'MeowCRM — 自動導航 CRM', template: '%s | MeowCRM' },
  description: 'MeowCRM 是專為中小企業打造的智慧 CRM，自動追蹤客戶互動、管理任務、歸檔會議紀錄。免費開始，讓你專注建立關係。',
  openGraph: {
    type: 'website',
    siteName: 'MeowCRM',
    locale: 'zh_TW',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-Hant">
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-mc-primary-600">
          跳到主要內容
        </a>
        {children}
      </body>
    </html>
  )
}
