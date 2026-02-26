import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Contact, ListTodo, UserPlus } from "lucide-react"

interface DashboardStatsProps {
  customerCount: number
  contactCount: number
  pendingTaskCount: number
  newCustomersThisMonth: number
}

const stats = [
  { key: "customerCount" as const, label: "客戶總數", icon: Users, color: "text-mc-primary-600", bgColor: "bg-mc-primary-50" },
  { key: "contactCount" as const, label: "聯絡人總數", icon: Contact, color: "text-mc-pink-600", bgColor: "bg-mc-pink-50" },
  { key: "pendingTaskCount" as const, label: "待辦任務數", icon: ListTodo, color: "text-mc-gold-600", bgColor: "bg-mc-gold-50" },
  { key: "newCustomersThisMonth" as const, label: "本月新增客戶", icon: UserPlus, color: "text-mc-primary-700", bgColor: "bg-gradient-to-br from-mc-primary-50 to-mc-pink-50" },
]

export function DashboardStats(props: DashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ key, label, icon: Icon, color, bgColor }) => (
        <Card key={key} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {label}
            </CardTitle>
            <div className={`p-2 rounded-xl ${bgColor}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${color}`}>{props[key]}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
