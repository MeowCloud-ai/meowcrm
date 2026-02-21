"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { UserCircle } from "lucide-react"

interface ProfileProps {
  email: string
  name: string | null
  role: string | null
}

export function ProfileSettings({ email, name, role }: ProfileProps) {
  const roleLabelMap: Record<string, string> = {
    owner: "擁有者",
    admin: "管理員",
    member: "成員",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCircle className="h-5 w-5" />
          個人資訊
        </CardTitle>
        <CardDescription>您目前的帳號資訊</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label className="text-muted-foreground text-sm">電子郵件</Label>
          <p className="font-medium">{email}</p>
        </div>
        {name && (
          <div className="space-y-1">
            <Label className="text-muted-foreground text-sm">顯示名稱</Label>
            <p className="font-medium">{name}</p>
          </div>
        )}
        {role && (
          <div className="space-y-1">
            <Label className="text-muted-foreground text-sm">組織角色</Label>
            <p className="font-medium">{roleLabelMap[role] ?? role}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
