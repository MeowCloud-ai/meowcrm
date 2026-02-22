import Link from "next/link"
import { MeowCloudLogo } from "@/components/meowcloud-logo"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-mc-primary-50/30 to-mc-pink-50/20 py-24 sm:py-32">
      {/* Aurora Gradient Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-br from-mc-primary-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-gradient-to-bl from-mc-pink-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-mc-primary-50 to-mc-pink-50 px-6 py-2 text-sm font-medium border border-mc-primary-100">
          <MeowCloudLogo size={16} className="text-mc-primary-600" />
          <span className="bg-gradient-to-r from-mc-primary-600 to-mc-pink-600 bg-clip-text text-transparent">
            MeowCRM — 自動導航 CRM
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          你專心開會，
          <br />
          <span className="bg-gradient-to-r from-mc-primary-600 via-mc-pink-500 to-mc-gold-500 bg-clip-text text-transparent">
            我幫你管客戶
          </span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
          智慧化客戶關係管理，自動追蹤互動、提醒任務、歸檔紀錄。
          <br className="hidden sm:block" />
          讓你專注在最重要的事——建立關係。
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-4">
          <Link
            href="/signup"
            className="relative rounded-full bg-gradient-to-r from-mc-primary-600 to-mc-pink-600 px-8 py-3 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-mc-primary-500/25 transition-all duration-200 hover:scale-105"
          >
            免費開始
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-gray-300 px-8 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 hover:border-mc-primary-300 transition-all duration-200"
          >
            登入
          </Link>
        </div>
      </div>
    </section>
  )
}
