import { z } from "zod"

export const customerFormSchema = z.object({
  name: z.string().min(1, "公司名稱為必填欄位"),
  industry: z.string(),
  status: z.enum(["active", "inactive", "lead"], {
    message: "請選擇客戶狀態",
  }),
  notes: z.string(),
})

export type CustomerFormValues = z.infer<typeof customerFormSchema>
