import { z } from "zod"

export const taskStatuses = ["todo", "in_progress", "done"] as const
export type TaskStatus = (typeof taskStatuses)[number]

export const taskStatusLabels: Record<TaskStatus, string> = {
  todo: "待辦",
  in_progress: "進行中",
  done: "完成",
}

export const taskFormSchema = z.object({
  title: z.string().min(1, "標題為必填欄位"),
  status: z.enum(taskStatuses, { message: "請選擇狀態" }),
  due_date: z.string(),
  notes: z.string(),
  customer_id: z.string(),
})

export type TaskFormValues = z.infer<typeof taskFormSchema>
