import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react"

const typeLabels: Record<string, { label: string; icon: string }> = {
  meeting: { label: "會議", icon: "🤝" },
  call: { label: "電話", icon: "📞" },
  email: { label: "Email", icon: "📧" },
  visit: { label: "拜訪", icon: "🏢" },
  note: { label: "筆記", icon: "📝" },
}

interface RecentActivity {
  id: string
  type: string
  summary: string | null
  occurred_at: string
  customers: { id: string; name: string } | { id: string; name: string }[] | null
}

interface RecentActivitiesProps {
  activities: RecentActivity[]
}

function getCustomerName(customers: RecentActivity["customers"]): string {
  if (!customers) return "未知客戶"
  const c = Array.isArray(customers) ? customers[0] : customers
  return c?.name ?? "未知客戶"
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("zh-TW", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Activity className="h-5 w-5 text-muted-foreground" />
        <CardTitle>近期活動</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">尚無互動紀錄</p>
        ) : (
          <div className="space-y-3">
            {activities.map((a) => {
              const t = typeLabels[a.type] ?? { label: a.type, icon: "📌" }
              return (
                <div
                  key={a.id}
                  className="flex items-start justify-between gap-2 rounded-md border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span>{t.icon}</span>
                      <Badge variant="secondary">{t.label}</Badge>
                      <span className="truncate text-sm font-medium">
                        {a.summary ?? "（無摘要）"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {getCustomerName(a.customers)}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDate(a.occurred_at)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
