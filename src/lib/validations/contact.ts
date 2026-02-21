import { z } from "zod"

export const contactFormSchema = z.object({
  name: z.string().min(1, "姓名為必填欄位"),
  title: z.string(),
  email: z.string().refine(
    (val) => val === "" || z.string().email().safeParse(val).success,
    { message: "請輸入有效的 Email 地址" }
  ),
  phone: z.string(),
  notes: z.string(),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>

export interface Contact {
  id: string
  org_id: string
  customer_id: string
  name: string
  title: string | null
  email: string | null
  phone: string | null
  notes: string | null
  created_at: string
  updated_at: string
}
