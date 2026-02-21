export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { CustomerForm } from "@/components/customer-form"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditCustomerPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: customer, error } = await supabase
    .from("customers")
    .select("id, name, industry, status, notes")
    .eq("id", id)
    .is("deleted_at", null)
    .single()

  if (error || !customer) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">編輯客戶</h1>
        <p className="text-muted-foreground">修改客戶資料</p>
      </div>
      <CustomerForm
        defaultValues={{
          id: customer.id,
          name: customer.name,
          industry: customer.industry ?? "",
          status: customer.status ?? "active",
          notes: customer.notes ?? "",
        }}
      />
    </div>
  )
}
