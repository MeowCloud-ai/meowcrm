"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { TaskFormDialog } from "@/components/task-form-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar } from "lucide-react"
import type { Task } from "@/components/task-board"

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  todo: { label: "待辦", variant: "outline" },
  in_progress: { label: "進行中", variant: "default" },
  done: { label: "完成", variant: "secondary" },
}

interface TaskListProps {
  customerId: string
  initialTasks: Task[]
}

export function TaskList({ customerId, initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isCreating, setIsCreating] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setIsCreating(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          新增任務
        </Button>
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            尚無任務
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => {
            const info = statusLabels[task.status] ?? { label: task.status, variant: "outline" as const }
            const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== "done"
            return (
              <Card
                key={task.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setEditingTask(task)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="space-y-1">
                    <p className="font-medium">{task.title}</p>
                    {task.due_date && (
                      <span className={`flex items-center gap-1 text-xs text-muted-foreground ${isOverdue ? "text-red-500 font-medium" : ""}`}>
                        <Calendar className="h-3 w-3" />
                        {task.due_date}
                      </span>
                    )}
                  </div>
                  <Badge variant={info.variant}>{info.label}</Badge>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <TaskFormDialog
        open={isCreating}
        onOpenChange={setIsCreating}
        defaultCustomerId={customerId}
        onSuccess={(task) => setTasks((prev) => [task, ...prev])}
      />

      <TaskFormDialog
        open={!!editingTask}
        onOpenChange={(open) => { if (!open) setEditingTask(null) }}
        task={editingTask}
        onSuccess={(updated) =>
          setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
        }
        onDelete={(id) => setTasks((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  )
}
