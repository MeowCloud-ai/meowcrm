"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useOrganization } from "@/lib/hooks/use-organization"
import { Building2, Loader2, Check } from "lucide-react"

export function OrgSettings({ initialName, userRole }: { initialName: string; userRole: string | null }) {
  const canEdit = userRole === "owner" || userRole === "admin"
  const [name, setName] = useState(initialName)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const { organization } = useOrganization()
  const supabase = createClient()

  async function handleSave() {
    if (!organization || !name.trim()) return
    setSaving(true)
    setSaved(false)

    const { error } = await supabase
      .from("organizations")
      .update({ name: name.trim() })
      .eq("id", organization.id)

    setSaving(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          組織資訊
        </CardTitle>
        <CardDescription>管理您的組織名稱與基本資訊</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="org-name">組織名稱</Label>
          <div className="flex gap-2">
            <Input
              id="org-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="輸入組織名稱"
              disabled={!canEdit}
            />
            {canEdit && (
              <Button onClick={handleSave} disabled={saving || !name.trim()}>
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : saved ? (
                  <Check className="h-4 w-4" />
                ) : (
                  "儲存"
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
