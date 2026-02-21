const features = [
  {
    icon: "👥",
    title: "客戶管理",
    description: "集中管理所有客戶資訊，一目了然。標籤分類、快速搜尋，再也不怕遺漏重要客戶。",
  },
  {
    icon: "💬",
    title: "互動追蹤",
    description: "自動記錄每次通話、會議、郵件。完整互動歷史，隨時掌握客戶動態。",
  },
  {
    icon: "📋",
    title: "任務看板",
    description: "視覺化任務管理，拖拉即可更新狀態。設定提醒，確保每個跟進都不遺漏。",
  },
  {
    icon: "🗂️",
    title: "智慧歸檔",
    description: "自動分類與歸檔客戶資料，智慧標籤讓搜尋更快速，團隊協作更順暢。",
  },
]

export function Features() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            一站式客戶管理
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            從第一次接觸到長期維繫，MeowCRM 陪你走完每一步
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl bg-white p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-gray-600 leading-7">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
