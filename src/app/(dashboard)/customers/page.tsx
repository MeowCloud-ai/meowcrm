import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CustomerList } from "./customer-list"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function CustomersPage({ searchParams }: PageProps) {
  const params = await searchParams
  const search = params.search ?? ""
  const status = params.status ?? "all"
  const page = Math.max(1, parseInt(params.page ?? "1", 10))
  const pageSize = 10

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  let query = supabase
    .from("customers")
    .select("id, name, industry, status, created_at", { count: "exact" })
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (search) {
    query = query.ilike("name", `%${search}%`)
  }

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  const { data: customers, count, error } = await query

  const totalPages = Math.ceil((count ?? 0) / pageSize)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">客戶管理</h1>
        <p className="text-muted-foreground">管理您的客戶資料</p>
      </div>

      <CustomerList
        customers={customers ?? []}
        totalPages={totalPages}
        currentPage={page}
        currentSearch={search}
        currentStatus={status}
        totalCount={count ?? 0}
      />
    </div>
  )
}
