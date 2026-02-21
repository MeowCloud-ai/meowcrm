import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { CustomerDetail } from "@/components/customer-detail"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CustomerDetailPage({ params }: PageProps) {
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
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single()

  if (error || !customer) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <CustomerDetail customer={customer} />
    </div>
  )
}
