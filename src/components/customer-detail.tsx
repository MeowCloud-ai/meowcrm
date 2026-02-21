"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Pencil, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { ContactList } from "@/components/contact-list"
import { type Contact } from "@/lib/validations/contact"

interface Customer {
  id: string
  org_id: string
  name: string
  industry: string | null
  status: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "活躍", variant: "default" },
  inactive: { label: "不活躍", variant: "secondary" },
  lead: { label: "潛在客戶", variant: "outline" },
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

export function CustomerDetail({ customer, contacts }: { customer: Customer; contacts: Contact[] }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const statusInfo = statusMap[customer.status ?? ""] ?? {
    label: customer.status ?? "未知",
    variant: "outline" as const,
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("customers")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", customer.id)

      if (error) throw error
      router.push("/customers")
      router.refresh()
    } catch {
      setDeleting(false)
      alert("刪除失敗，請稍後再試")
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/customers">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{customer.name}</h1>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/customers/${customer.id}/edit`}>
              <Pencil className="mr-1.5 h-4 w-4" />
              編輯
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={deleting}>
                <Trash2 className="mr-1.5 h-4 w-4" />
                {deleting ? "刪除中..." : "刪除"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>確認刪除客戶</AlertDialogTitle>
                <AlertDialogDescription>
                  確定要刪除「{customer.name}」嗎？此操作可以復原。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                  {deleting ? "刪除中..." : "確認刪除"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Basic Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>基本資訊</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">客戶名稱</dt>
              <dd className="mt-1">{customer.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">產業</dt>
              <dd className="mt-1">{customer.industry ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">狀態</dt>
              <dd className="mt-1">
                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">備註</dt>
              <dd className="mt-1 whitespace-pre-wrap">{customer.notes ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">建立時間</dt>
              <dd className="mt-1">{formatDate(customer.created_at)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">更新時間</dt>
              <dd className="mt-1">{formatDate(customer.updated_at)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="contacts">
        <TabsList>
          <TabsTrigger value="contacts">聯絡人</TabsTrigger>
          <TabsTrigger value="interactions">互動紀錄</TabsTrigger>
          <TabsTrigger value="tasks">任務</TabsTrigger>
        </TabsList>
        <TabsContent value="contacts">
          <ContactList customerId={customer.id} initialContacts={contacts} />
        </TabsContent>
        <TabsContent value="interactions">
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              互動紀錄功能即將推出
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tasks">
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              任務功能即將推出
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}
