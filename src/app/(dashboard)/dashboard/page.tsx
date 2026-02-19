import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">總覽</h1>
      <Card>
        <CardHeader>
          <CardTitle>歡迎使用 MeowCRM 🐱</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            您的自動導航 CRM 系統已準備就緒。開始管理您的客戶、聯絡人和任務吧！
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
