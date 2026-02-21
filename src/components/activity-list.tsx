"use client"

import { useCallback, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  type Activity,
  activityTypeLabels,
  type ActivityType,
} from "@/lib/validations/activity"
import { type Contact } from "@/lib/validations/contact"
import { ActivityFormDialog } from "@/components/activity-form-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, CalendarDays } from "lucide-react"

interface ActivityListProps {
  customerId: string
  initialActivities: Activity[]
  contacts: Contact[]
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function ActivityList({ customerId, initialActivities, contacts }: ActivityListProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchActivities = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("activities")
      .select("*, contacts(id, name)")
      .eq("customer_id", customerId)
      .order("occurred_at", { ascending: false })
    if (data) setActivities(data as Activity[])
  }, [customerId])

  useEffect(() => {
    setActivities(initialActivities)
  }, [initialActivities])

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("activities").delete().eq("id", id)
      if (error) throw error
      await fetchActivities()
    } catch {
      alert("刪除失敗，請稍後再試")
    } finally {
      setDeleting(null)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">互動紀錄</CardTitle>
        <ActivityFormDialog
          customerId={customerId}
          contacts={contacts}
          onSuccess={fetchActivities}
        />
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
            <CalendarDays className="h-10 w-10" />
            <p>尚無互動紀錄</p>
            <p className="text-sm">點擊「新增互動」來建立第一筆紀錄</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => {
              const typeInfo = activityTypeLabels[activity.type as ActivityType] ?? {
                label: activity.type,
                icon: "📋",
              }
              return (
                <div
                  key={activity.id}
                  className="flex items-start justify-between rounded-lg border p-3"
                >
                  <div className="flex gap-3">
                    <span className="mt-0.5 text-xl">{typeInfo.icon}</span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{typeInfo.label}</Badge>
                        <span className="font-medium">{activity.summary ?? "（無摘要）"}</span>
                      </div>
                      {activity.details && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {activity.details}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{formatDate(activity.occurred_at)}</span>
                        {activity.contacts?.name && (
                          <span>👤 {activity.contacts.name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        disabled={deleting === activity.id}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>確認刪除互動紀錄</AlertDialogTitle>
                        <AlertDialogDescription>
                          確定要刪除此互動紀錄嗎？此操作無法復原。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(activity.id)}
                          disabled={deleting === activity.id}
                        >
                          {deleting === activity.id ? "刪除中..." : "確認刪除"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
