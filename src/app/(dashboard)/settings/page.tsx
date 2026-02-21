import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { OrgSettings } from "@/components/settings/org-settings"
import { MemberList, type Member } from "@/components/settings/member-list"
import { ProfileSettings } from "@/components/settings/profile-settings"

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const orgId = user.app_metadata?.org_id

  // Load organization
  let orgName = ""
  if (orgId) {
    const { data: org } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", orgId)
      .single()
    orgName = org?.name ?? ""
  }

  // Load members with user info
  let members: Member[] = []
  if (orgId) {
    const { data } = await supabase
      .from("org_members")
      .select("id, role, created_at, user_id")
      .eq("org_id", orgId)
      .order("created_at", { ascending: true })

    if (data) {
      members = data.map((m) => ({
        id: m.id,
        role: m.role,
        created_at: m.created_at,
        user_email: m.user_id === user.id ? user.email! : m.user_id,
        user_name: m.user_id === user.id ? (user.user_metadata?.full_name ?? null) : null,
      }))
    }
  }

  // Current user's role
  let currentRole: string | null = null
  if (orgId) {
    const { data: membership } = await supabase
      .from("org_members")
      .select("role")
      .eq("org_id", orgId)
      .eq("user_id", user.id)
      .single()
    currentRole = membership?.role ?? null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">設定</h1>
        <p className="text-muted-foreground">管理您的組織與個人設定</p>
      </div>

      <div className="grid gap-6">
        <OrgSettings initialName={orgName} />
        <MemberList members={members} />
        <ProfileSettings
          email={user.email!}
          name={user.user_metadata?.full_name ?? null}
          role={currentRole}
        />
      </div>
    </div>
  )
}
