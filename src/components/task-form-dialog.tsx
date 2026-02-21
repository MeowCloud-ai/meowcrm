"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/supabase/client"
import {
  taskFormSchema,
  taskStatuses,
  taskStatusLabels,
  type TaskFormValues,
} from "@/lib/validations/task"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import type { Task } from "@/components/task-board"

interface CustomerOption {
  id: string
  name: string
}

interface TaskFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task | null
  defaultStatus?: string
  defaultCustomerId?: string
  onSuccess: (task: Task) => void
  onDelete?: (taskId: string) => void
}

export function TaskFormDialog({
  open,
  onOpenChange,
  task,
  defaultStatus,
  defaultCustomerId,
  onSuccess,
  onDelete,
}: TaskFormDialogProps) {
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [customers, setCustomers] = useState<CustomerOption[]>([])
  const supabase = createClient()
  const isEdit = !!task

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      status: (defaultStatus as TaskFormValues["status"]) ?? "todo",
      due_date: "",
      notes: "",
      customer_id: defaultCustomerId ?? "",
    },
  })

  // Load customers for dropdown
  useEffect(() => {
    if (!open) return
    supabase
      .from("customers")
      .select("id, name")
      .is("deleted_at", null)
      .order("name")
      .then(({ data }) => {
        if (data) setCustomers(data)
      })
  }, [open, supabase])

  // Reset form when opening
  useEffect(() => {
    if (!open) return
    if (task) {
      form.reset({
        title: task.title,
        status: task.status as TaskFormValues["status"],
        due_date: task.due_date ?? "",
        notes: task.notes ?? "",
        customer_id: task.customer_id ?? "",
      })
    } else {
      form.reset({
        title: "",
        status: (defaultStatus as TaskFormValues["status"]) ?? "todo",
        due_date: "",
        notes: "",
        customer_id: defaultCustomerId ?? "",
      })
    }
  }, [open, task, defaultStatus, defaultCustomerId, form])

  async function onSubmit(values: TaskFormValues) {
    setSubmitting(true)
    try {
      const payload = {
        title: values.title.trim(),
        status: values.status,
        due_date: values.due_date || null,
        notes: values.notes || null,
        customer_id: values.customer_id || null,
        updated_at: new Date().toISOString(),
      }

      if (isEdit) {
        const { data, error } = await supabase
          .from("tasks")
          .update(payload)
          .eq("id", task.id)
          .select(`
            id, title, status, due_date, assigned_to, customer_id,
            notes, source, created_at, updated_at,
            customers ( id, name )
          `)
          .single()
        if (error) throw error
        onSuccess(data as Task)
      } else {
        const { data: { user } } = await supabase.auth.getUser()
        const orgId = user?.app_metadata?.org_id
        if (!orgId) throw new Error("missing org_id")
        const { data, error } = await supabase
          .from("tasks")
          .insert({
            ...payload,
            source: "manual",
            org_id: orgId,
          })
          .select(`
            id, title, status, due_date, assigned_to, customer_id,
            notes, source, created_at, updated_at,
            customers ( id, name )
          `)
          .single()
        if (error) throw error
        onSuccess(data as Task)
      }
      onOpenChange(false)
    } catch {
      alert(isEdit ? "更新失敗" : "新增失敗")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!task || !onDelete) return
    setDeleting(true)
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", task.id)
      if (error) throw error
      onDelete(task.id)
      onOpenChange(false)
    } catch {
      alert("刪除失敗")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "編輯任務" : "新增任務"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>標題 *</FormLabel>
                  <FormControl>
                    <Input placeholder="任務標題" {...field} />
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {taskStatuses.map((s) => (
                        <SelectItem key={s} value={s}>
                          {taskStatusLabels[s]}
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
              name="due_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>到期日</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customer_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>關聯客戶</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇客戶（可不選）" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">不關聯</SelectItem>
                      {customers.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
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
                    <Textarea placeholder="備註..." rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              {isEdit && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="mr-auto"
                >
                  {deleting ? "刪除中..." : "刪除任務"}
                </Button>
              )}
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
