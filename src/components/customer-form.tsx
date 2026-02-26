"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  customerFormSchema,
  type CustomerFormValues,
} from "@/lib/validations/customer"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CustomerFormProps {
  defaultValues?: CustomerFormValues & { id?: string }
}

const statusOptions = [
  { value: "active", label: "活躍" },
  { value: "inactive", label: "非活躍" },
  { value: "lead", label: "潛在客戶" },
]

export function CustomerForm({ defaultValues }: CustomerFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const isEditing = !!defaultValues?.id

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      industry: defaultValues?.industry ?? "",
      status: defaultValues?.status ?? "active",
      notes: defaultValues?.notes ?? "",
    },
  })

  async function onSubmit(values: CustomerFormValues) {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const orgId = user?.app_metadata?.org_id
      if (!orgId) throw new Error("尚未建立組織，請重新登入")

      if (isEditing) {
        const { error: updateError } = await supabase
          .from("customers")
          .update({
            name: values.name,
            industry: values.industry || null,
            status: values.status,
            notes: values.notes || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", defaultValues!.id!)

        if (updateError) throw updateError
        router.push(`/customers`)
      } else {
        const { error: insertError } = await supabase
          .from("customers")
          .insert({
            org_id: orgId,
            name: values.name,
            industry: values.industry || null,
            status: values.status,
            notes: values.notes || null,
          })

        if (insertError) throw insertError
        router.push("/customers")
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失敗，請稍後再試")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>公司名稱 *</FormLabel>
              <FormControl>
                <Input placeholder="請輸入公司名稱" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>產業</FormLabel>
              <FormControl>
                <Input placeholder="例如：科技、金融、製造" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>狀態</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="請選擇狀態" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>備註</FormLabel>
              <FormControl>
                <Textarea placeholder="客戶相關備註" rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "儲存中..." : isEditing ? "更新客戶" : "新增客戶"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            取消
          </Button>
        </div>
      </form>
    </Form>
  )
}
