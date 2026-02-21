import { z } from "zod"

export const activityTypes = ["meeting", "call", "email", "visit", "note"] as const
export type ActivityType = (typeof activityTypes)[number]

export const activityTypeLabels: Record<ActivityType, { label: string; icon: string }> = {
  meeting: { label: "會議", icon: "🤝" },
  call: { label: "電話", icon: "📞" },
  email: { label: "Email", icon: "📧" },
  visit: { label: "拜訪", icon: "🏢" },
  note: { label: "筆記", icon: "📝" },
}

export const activityFormSchema = z.object({
  type: z.enum(activityTypes, { message: "請選擇類型" }),
  summary: z.string().min(1, "摘要為必填欄位"),
  details: z.string(),
  contact_id: z.string(),
  occurred_at: z.string().min(1, "請選擇發生時間"),
})

export type ActivityFormValues = z.infer<typeof activityFormSchema>

export interface Activity {
  id: string
  org_id: string
  customer_id: string
  contact_id: string | null
  type: ActivityType
  summary: string | null
  details: string | null
  meeting_ref: string | null
  occurred_at: string
  created_at: string
  contacts?: { id: string; name: string } | null
}
