"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Search, Users } from "lucide-react"

interface Customer {
  id: string
  name: string
  industry: string | null
  status: string
  created_at: string
}

interface CustomerListProps {
  customers: Customer[]
  totalPages: number
  currentPage: number
  currentSearch: string
  currentStatus: string
  totalCount: number
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  active: { label: "活躍", variant: "default" },
  inactive: { label: "停用", variant: "secondary" },
  lead: { label: "潛在客戶", variant: "outline" },
}

export function CustomerList({
  customers,
  totalPages,
  currentPage,
  currentSearch,
  currentStatus,
  totalCount,
}: CustomerListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams()
      const merged = {
        search: currentSearch,
        status: currentStatus,
        page: String(currentPage),
        ...updates,
      }
      // Reset page when search/status changes
      if ("search" in updates || "status" in updates) {
        merged.page = "1"
      }
      for (const [k, v] of Object.entries(merged)) {
        if (v && v !== "all" && v !== "1" && k !== "page") params.set(k, v)
        else if (k === "page" && v !== "1") params.set(k, v)
      }
      const qs = params.toString()
      startTransition(() => {
        router.push(`/customers${qs ? `?${qs}` : ""}`)
      })
    },
    [currentSearch, currentStatus, currentPage, router]
  )

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜尋公司名稱..."
            defaultValue={currentSearch}
            className="pl-9"
            onChange={(e) => {
              const value = e.target.value
              // Debounce-like: update on each change
              updateParams({ search: value })
            }}
          />
        </div>
        <Select
          value={currentStatus}
          onValueChange={(value) => updateParams({ status: value })}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="篩選狀態" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部狀態</SelectItem>
            <SelectItem value="active">活躍</SelectItem>
            <SelectItem value="inactive">停用</SelectItem>
            <SelectItem value="lead">潛在客戶</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading overlay */}
      <div className={isPending ? "opacity-50 pointer-events-none" : ""}>
        {customers.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">尚無客戶資料</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {currentSearch || currentStatus !== "all"
                ? "找不到符合條件的客戶，請調整搜尋或篩選條件"
                : "開始新增您的第一位客戶吧"}
            </p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>公司名稱</TableHead>
                    <TableHead className="hidden sm:table-cell">產業</TableHead>
                    <TableHead>狀態</TableHead>
                    <TableHead className="hidden sm:table-cell">建立時間</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => {
                    const s = statusMap[customer.status] ?? statusMap.lead
                    return (
                      <TableRow
                        key={customer.id}
                        className="cursor-pointer"
                        onClick={() => router.push(`/customers/${customer.id}`)}
                      >
                        <TableCell className="font-medium">
                          {customer.name}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                          {customer.industry ?? "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={s.variant}>{s.label}</Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                          {new Date(customer.created_at).toLocaleDateString(
                            "zh-TW"
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                共 {totalCount} 筆，第 {currentPage}/{totalPages} 頁
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() =>
                    updateParams({ page: String(currentPage - 1) })
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                  上一頁
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() =>
                    updateParams({ page: String(currentPage + 1) })
                  }
                >
                  下一頁
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
