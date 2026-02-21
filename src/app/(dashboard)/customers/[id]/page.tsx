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

  const { data: contacts } = await supabase
    .from("contacts")
    .select("*")
    .eq("customer_id", id)
    .order("created_at", { ascending: false })

  const { data: activities } = await supabase
    .from("activities")
    .select("*, contacts(id, name)")
    .eq("customer_id", id)
    .order("occurred_at", { ascending: false })

  return (
    <div className="space-y-6">
      <CustomerDetail customer={customer} contacts={contacts ?? []} activities={activities ?? []} />
    </div>
  )
}
