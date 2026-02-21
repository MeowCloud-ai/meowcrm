import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Contact, ListTodo, UserPlus } from "lucide-react"

interface DashboardStatsProps {
  customerCount: number
  contactCount: number
  pendingTaskCount: number
  newCustomersThisMonth: number
}

const stats = [
  { key: "customerCount" as const, label: "客戶總數", icon: Users, color: "text-blue-600" },
  { key: "contactCount" as const, label: "聯絡人總數", icon: Contact, color: "text-green-600" },
  { key: "pendingTaskCount" as const, label: "待辦任務數", icon: ListTodo, color: "text-orange-600" },
  { key: "newCustomersThisMonth" as const, label: "本月新增客戶", icon: UserPlus, color: "text-purple-600" },
]

export function DashboardStats(props: DashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ key, label, icon: Icon, color }) => (
        <Card key={key}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {label}
            </CardTitle>
            <Icon className={`h-5 w-5 ${color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{props[key]}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
