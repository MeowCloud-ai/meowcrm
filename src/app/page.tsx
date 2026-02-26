import type { Metadata } from "next"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"

export const metadata: Metadata = {
  title: 'MeowCRM — 自動導航 CRM｜你專心開會，我幫你管客戶',
  description: '專為中小企業打造的免費智慧 CRM。自動追蹤客戶互動、管理任務、歸檔會議紀錄。與 MeowMeet 整合，會議數據自動流入客戶管理。',
  openGraph: { title: 'MeowCRM — 自動導航 CRM', description: '你專心開會，我幫你管客戶。免費智慧 CRM。' },
}

export default function HomePage() {
  return (
    <main id="main-content" className="min-h-screen bg-white">
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </main>
  )
}
