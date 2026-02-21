import Link from "next/link"

export function CTA() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          準備好讓客戶管理自動化了嗎？
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          免費註冊，立即體驗 MeowCRM 的強大功能。不需信用卡。
        </p>
        <div className="mt-8">
          <Link
            href="/signup"
            className="inline-block rounded-lg bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            免費開始
          </Link>
        </div>
      </div>
    </section>
  )
}
