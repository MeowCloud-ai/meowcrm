"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Clock } from "lucide-react"

interface Task {
  id: string
  title: string
  due_date: string | null
  status: string
  customers?: { id: string; name: string } | { id: string; name: string }[] | null
}

interface TaskRemindersProps {
  tasks: Task[]
}

function getCustomerName(customers: Task["customers"]): string {
  if (!customers) return ""
  const c = Array.isArray(customers) ? customers[0] : customers
  return c?.name ? ` · ${c.name}` : ""
}

export function TaskReminders({ tasks }: TaskRemindersProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const dayAfterTomorrow = new Date(tomorrow)
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

  const overdue = tasks.filter((t) => {
    if (!t.due_date || t.status === "done") return false
    return new Date(t.due_date + "T00:00:00") < today
  })

  const dueTomorrow = tasks.filter((t) => {
    if (!t.due_date || t.status === "done") return false
    const d = new Date(t.due_date + "T00:00:00")
    return d >= tomorrow && d < dayAfterTomorrow
  })

  if (overdue.length === 0 && dueTomorrow.length === 0) return null

  return (
    <div className="space-y-3">
      {overdue.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>🔴 已過期的任務（{overdue.length}）</AlertTitle>
          <AlertDescription>
            <ul className="mt-1 list-disc pl-4 space-y-1">
              {overdue.map((t) => (
                <li key={t.id}>
                  <span className="font-medium">{t.title}</span>
                  <span className="text-xs ml-2 opacity-75">
                    到期日：{t.due_date}
                    {getCustomerName(t.customers)}
                  </span>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {dueTomorrow.length > 0 && (
        <Alert className="border-yellow-500/50 text-yellow-700 dark:text-yellow-400 [&>svg]:text-yellow-600">
          <Clock className="h-4 w-4" />
          <AlertTitle>🟡 明天到期的任務（{dueTomorrow.length}）</AlertTitle>
          <AlertDescription>
            <ul className="mt-1 list-disc pl-4 space-y-1">
              {dueTomorrow.map((t) => (
                <li key={t.id}>
                  <span className="font-medium">{t.title}</span>
                  <span className="text-xs ml-2 opacity-75">
                    到期日：{t.due_date}
                    {getCustomerName(t.customers)}
                  </span>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
