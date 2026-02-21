import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentActivities } from "@/components/recent-activities"
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
  const userName =
    user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? "使用者"

  // --- Stats queries (parallel) ---
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0]

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split("T")[0]

  // Build queries with optional org_id filter
  const customerCountQ = supabase.from("customers").select("*", { count: "exact", head: true })
  const contactCountQ = supabase.from("contacts").select("*", { count: "exact", head: true })
  const pendingTaskQ = supabase.from("tasks").select("*", { count: "exact", head: true }).neq("status", "done")
  const newCustomerQ = supabase.from("customers").select("*", { count: "exact", head: true }).gte("created_at", firstDayOfMonth)
  const recentActivityQ = supabase.from("activities").select("id, type, summary, occurred_at, customers ( id, name )").order("occurred_at", { ascending: false }).limit(5)
  const urgentTaskQ = supabase.from("tasks").select("id, title, status, due_date, customers ( id, name )").lte("due_date", tomorrowStr).neq("status", "done")

  if (orgId) {
    customerCountQ.eq("org_id", orgId)
    contactCountQ.eq("org_id", orgId)
    pendingTaskQ.eq("org_id", orgId)
    newCustomerQ.eq("org_id", orgId)
    recentActivityQ.eq("org_id", orgId)
    urgentTaskQ.eq("org_id", orgId)
  }

  const [
    { count: customerCount },
    { count: contactCount },
    { count: pendingTaskCount },
    { count: newCustomersThisMonth },
    { data: recentActivities },
    { data: urgentTasks },
  ] = await Promise.all([
    customerCountQ,
    contactCountQ,
    pendingTaskQ,
    newCustomerQ,
    recentActivityQ,
    urgentTaskQ,
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">總覽</h1>
        <p className="text-muted-foreground">
          👋 歡迎回來，{userName}！
        </p>
      </div>

      <DashboardStats
        customerCount={customerCount ?? 0}
        contactCount={contactCount ?? 0}
        pendingTaskCount={pendingTaskCount ?? 0}
        newCustomersThisMonth={newCustomersThisMonth ?? 0}
      />

      <TaskReminders tasks={urgentTasks ?? []} />

      <RecentActivities activities={recentActivities ?? []} />
    </div>
  )
}
