import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "活動紀錄",
  description: "所有客戶互動紀錄",
}

const typeLabels: Record<string, string> = {
  meeting: "會議",
  call: "電話",
  email: "Email",
  visit: "拜訪",
  other: "其他",
}

export default async function ActivitiesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const orgId = user.app_metadata?.org_id

  let query = supabase
    .from("activities")
    .select("id, type, summary, occurred_at, customer_id, customers ( id, name )")
    .order("occurred_at", { ascending: false })
    .limit(50)

  if (orgId) query = query.eq("org_id", orgId)

  const { data: activities } = await query

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-mc-primary-600 to-mc-pink-600 bg-clip-text text-transparent">活動紀錄</h1>
        <p className="text-muted-foreground">所有客戶互動的完整紀錄</p>
      </div>

      {!activities?.length ? (
        <div className="text-center py-12">
          <Activity className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">尚無活動紀錄</p>
          <p className="text-sm text-muted-foreground">在客戶詳情頁新增互動紀錄</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((a: any) => (
            <Link key={a.id} href={`/customers/${a.customer_id}`} className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 hover:border-mc-primary-200 transition-colors">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{typeLabels[a.type] || a.type}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(a.occurred_at).toLocaleDateString("zh-TW")}
                  </span>
                </div>
                <p className="text-sm">{a.summary || "（無摘要）"}</p>
              </div>
              <span className="text-sm text-mc-primary-600">{(a.customers as any)?.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
