import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TaskBoard } from "@/components/task-board"
import { TaskReminders } from "@/components/task-reminders"

export default async function TasksPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: tasks } = await supabase
    .from("tasks")
    .select(`
      id,
      title,
      status,
      due_date,
      assigned_to,
      customer_id,
      notes,
      source,
      created_at,
      updated_at,
      customers ( id, name )
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">任務看板</h1>
        <p className="text-muted-foreground">管理您的任務進度</p>
      </div>
      <TaskReminders tasks={tasks ?? []} />
      <TaskBoard initialTasks={tasks ?? []} />
    </div>
  )
}
