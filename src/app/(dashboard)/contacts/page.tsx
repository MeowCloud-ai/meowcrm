import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Contact, Search } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "聯絡人",
  description: "管理所有客戶聯絡人",
}

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const orgId = user.app_metadata?.org_id
  const { q } = await searchParams

  let query = supabase
    .from("contacts")
    .select("id, name, title, email, phone, customer_id, customers ( id, name )")
    .order("name")

  if (orgId) query = query.eq("org_id", orgId)
  if (q) query = query.ilike("name", `%${q}%`)

  const { data: contacts } = await query

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-mc-primary-600 to-mc-pink-600 bg-clip-text text-transparent">聯絡人</h1>
        <p className="text-muted-foreground">管理所有客戶的聯絡窗口</p>
      </div>

      <form className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" placeholder="搜尋聯絡人..." defaultValue={q ?? ""} className="pl-10" />
        </div>
      </form>

      {!contacts?.length ? (
        <div className="text-center py-12">
          <Contact className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">尚無聯絡人</p>
          <p className="text-sm text-muted-foreground">在客戶詳情頁新增聯絡人</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <div className="grid grid-cols-5 gap-4 border-b p-4 text-sm font-medium text-muted-foreground">
            <span>姓名</span><span>職稱</span><span>Email</span><span>電話</span><span>所屬客戶</span>
          </div>
          {contacts.map((c: any) => (
            <Link key={c.id} href={`/customers/${c.customer_id}`} className="grid grid-cols-5 gap-4 border-b p-4 text-sm hover:bg-muted/50 last:border-0 hover:border-mc-primary-200 transition-colors">
              <span className="font-medium">{c.name}</span>
              <span className="text-muted-foreground">{c.title || "-"}</span>
              <span className="text-muted-foreground">{c.email || "-"}</span>
              <span className="text-muted-foreground">{c.phone || "-"}</span>
              <span className="text-mc-primary-600">{(c.customers as any)?.name || "-"}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
