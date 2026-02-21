"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { UsersRound } from "lucide-react"

export interface Member {
  id: string
  role: "owner" | "admin" | "member"
  created_at: string
  user_email: string
  user_name: string | null
}

const roleLabelMap: Record<string, string> = {
  owner: "擁有者",
  admin: "管理員",
  member: "成員",
}

const roleVariantMap: Record<string, "default" | "secondary" | "outline"> = {
  owner: "default",
  admin: "secondary",
  member: "outline",
}

export function MemberList({ members }: { members: Member[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UsersRound className="h-5 w-5" />
          組織成員
        </CardTitle>
        <CardDescription>目前組織共有 {members.length} 位成員</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名稱</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>加入時間</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  尚無成員
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    {member.user_name || member.user_email}
                  </TableCell>
                  <TableCell>
                    <Badge variant={roleVariantMap[member.role] ?? "outline"}>
                      {roleLabelMap[member.role] ?? member.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(member.created_at).toLocaleDateString("zh-TW")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
