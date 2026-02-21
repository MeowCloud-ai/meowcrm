export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CustomerForm } from "@/components/customer-form"

export default async function NewCustomerPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">新增客戶</h1>
        <p className="text-muted-foreground">填寫以下表單新增客戶資料</p>
      </div>
      <CustomerForm />
    </div>
  )
}
