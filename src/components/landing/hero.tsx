import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="mb-6 inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
          🐱 MeowCRM — 自動導航 CRM
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          你專心開會，
          <br />
          <span className="text-blue-600">我幫你管客戶</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
          智慧化客戶關係管理，自動追蹤互動、提醒任務、歸檔紀錄。
          <br className="hidden sm:block" />
          讓你專注在最重要的事——建立關係。
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-4">
          <Link
            href="/signup"
            className="rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            免費開始
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-gray-300 px-6 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            登入
          </Link>
        </div>
      </div>
    </section>
  )
}
