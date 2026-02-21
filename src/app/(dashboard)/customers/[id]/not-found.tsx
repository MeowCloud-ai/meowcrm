import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CustomerNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground text-lg">找不到此客戶</p>
      <p className="text-muted-foreground">客戶可能已被刪除或不存在</p>
      <Button asChild>
        <Link href="/customers">返回客戶列表</Link>
      </Button>
    </div>
  )
}
