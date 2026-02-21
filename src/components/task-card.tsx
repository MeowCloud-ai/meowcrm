"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User } from "lucide-react"
import type { Task } from "@/components/task-board"

function getCustomerName(customers: Task["customers"]): string | null {
  if (!customers) return null
  if (Array.isArray(customers)) return customers[0]?.name ?? null
  return customers.name
}

interface TaskCardProps {
  task: Task
  onDragStart: (e: React.DragEvent, taskId: string) => void
  onClick: (task: Task) => void
}

export function TaskCard({ task, onDragStart, onClick }: TaskCardProps) {
  const isOverdue =
    task.due_date && new Date(task.due_date) < new Date() && task.status !== "done"
  const customerName = getCustomerName(task.customers)

  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => onClick(task)}
      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-sm font-medium leading-tight">
          {task.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-1 space-y-2">
        {customerName && (
          <Badge variant="secondary" className="text-xs">
            {customerName}
          </Badge>
        )}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {task.due_date && (
            <span className={`flex items-center gap-1 ${isOverdue ? "text-red-500 font-medium" : ""}`}>
              <Calendar className="h-3 w-3" />
              {task.due_date}
            </span>
          )}
          {task.assigned_to && (
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              指派
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
