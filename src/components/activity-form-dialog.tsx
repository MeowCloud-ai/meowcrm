"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/supabase/client"
import {
  activityFormSchema,
  activityTypes,
  activityTypeLabels,
  type ActivityFormValues,
} from "@/lib/validations/activity"
import { type Contact } from "@/lib/validations/contact"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"

interface ActivityFormDialogProps {
  customerId: string
  contacts: Contact[]
  onSuccess: () => void
}

function toLocalDatetime(date: Date) {
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60000)
  return local.toISOString().slice(0, 16)
}

export function ActivityFormDialog({ customerId, contacts, onSuccess }: ActivityFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      type: "meeting",
      summary: "",
      details: "",
      contact_id: "",
      occurred_at: toLocalDatetime(new Date()),
    },
  })

  async function onSubmit(values: ActivityFormValues) {
    setSubmitting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("activities").insert({
        customer_id: customerId,
        type: values.type,
        summary: values.summary,
        details: values.details || null,
        contact_id: values.contact_id || null,
        occurred_at: new Date(values.occurred_at).toISOString(),
      })
      if (error) throw error
      setOpen(false)
      form.reset({
        type: "meeting",
        summary: "",
        details: "",
        contact_id: "",
        occurred_at: toLocalDatetime(new Date()),
      })
      onSuccess()
    } catch {
      alert("新增失敗，請稍後再試")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => {
      setOpen(v)
      if (v) {
        form.reset({
          type: "meeting",
          summary: "",
          details: "",
          contact_id: "",
          occurred_at: toLocalDatetime(new Date()),
        })
      }
    }}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          新增互動
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增互動紀錄</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>類型 *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇類型" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {activityTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {activityTypeLabels[t].icon} {activityTypeLabels[t].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>摘要 *</FormLabel>
                  <FormControl>
                    <Input placeholder="請輸入摘要" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>詳細內容</FormLabel>
                  <FormControl>
                    <Textarea placeholder="詳細說明..." rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>關聯聯絡人</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇聯絡人（可不選）" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">不關聯</SelectItem>
                      {contacts.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}{c.title ? ` — ${c.title}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="occurred_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>發生時間 *</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                取消
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "儲存中..." : "儲存"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
