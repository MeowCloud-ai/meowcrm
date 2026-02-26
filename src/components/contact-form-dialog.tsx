"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/supabase/client"
import { contactFormSchema, type ContactFormValues, type Contact } from "@/lib/validations/contact"
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
import { Plus, Pencil } from "lucide-react"

interface ContactFormDialogProps {
  customerId: string
  contact?: Contact
  onSuccess: () => void
}

export function ContactFormDialog({ customerId, contact, onSuccess }: ContactFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const isEdit = !!contact

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: contact?.name ?? "",
      title: contact?.title ?? "",
      email: contact?.email ?? "",
      phone: contact?.phone ?? "",
      notes: contact?.notes ?? "",
    },
  })

  async function onSubmit(values: ContactFormValues) {
    setSubmitting(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const payload = {
        name: values.name,
        title: values.title || null,
        email: values.email || null,
        phone: values.phone || null,
        notes: values.notes || null,
        updated_at: new Date().toISOString(),
      }

      if (isEdit) {
        const { error } = await supabase
          .from("contacts")
          .update(payload)
          .eq("id", contact.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from("contacts")
          .insert({ ...payload, customer_id: customerId, org_id: user?.app_metadata?.org_id })
        if (error) throw error
      }

      setOpen(false)
      form.reset()
      onSuccess()
    } catch {
      alert(isEdit ? "更新失敗，請稍後再試" : "新增失敗，請稍後再試")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => {
      setOpen(v)
      if (v && isEdit) {
        form.reset({
          name: contact.name,
          title: contact.title ?? "",
          email: contact.email ?? "",
          phone: contact.phone ?? "",
          notes: contact.notes ?? "",
        })
      }
    }}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            新增聯絡人
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "編輯聯絡人" : "新增聯絡人"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>姓名 *</FormLabel>
                  <FormControl>
                    <Input placeholder="請輸入姓名" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>職稱</FormLabel>
                  <FormControl>
                    <Input placeholder="例如：技術總監" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="example@company.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>電話</FormLabel>
                  <FormControl>
                    <Input placeholder="例如：0912-345-678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>備註</FormLabel>
                  <FormControl>
                    <Textarea placeholder="備註資訊..." {...field} />
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
