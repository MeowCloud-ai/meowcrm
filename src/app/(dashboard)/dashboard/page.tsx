import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TaskReminders } from "@/components/task-reminders"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const orgId = user.app_metadata?.org_id as string | undefined

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split("T")[0]

  let query = supabase
    .from("tasks")
    .select("id, title, status, due_date, customers ( id, name )")
    .lte("due_date", tomorrowStr)
    .neq("status", "done")

  if (orgId) {
    query = query.eq("org_id", orgId)
  }

  const { data: urgentTasks } = await query

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">總覽</h1>
      <TaskReminders tasks={urgentTasks ?? []} />
      <Card>
        <CardHeader>
          <CardTitle>歡迎使用 MeowCRM 🐱</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            您的自動導航 CRM 系統已準備就緒。開始管理您的客戶、聯絡人和任務吧！
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
