import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-12">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-lg font-semibold text-gray-900">
            🐱 MeowCRM
          </div>
          <nav className="flex gap-6 text-sm text-gray-600">
            <Link href="/login" className="hover:text-gray-900 transition-colors">登入</Link>
            <Link href="/signup" className="hover:text-gray-900 transition-colors">註冊</Link>
          </nav>
        </div>
        <div className="mt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} MeowCloud. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
