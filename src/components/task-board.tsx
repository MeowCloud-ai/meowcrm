"use client"

import { useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { TaskCard } from "@/components/task-card"
import { TaskFormDialog } from "@/components/task-form-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"

export interface Task {
  id: string
  title: string
  status: string
  due_date: string | null
  assigned_to: string | null
  customer_id: string | null
  notes: string | null
  source: string | null
  created_at: string
  updated_at: string
  customers: { id: string; name: string }[] | { id: string; name: string } | null
}

const COLUMNS = [
  { key: "todo", label: "待辦", color: "bg-slate-100 dark:bg-slate-800" },
  { key: "in_progress", label: "進行中", color: "bg-blue-50 dark:bg-blue-950" },
  { key: "done", label: "完成", color: "bg-green-50 dark:bg-green-950" },
] as const

interface TaskBoardProps {
  initialTasks: Task[]
}

export function TaskBoard({ initialTasks }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const supabase = createClient()

  const updateTaskStatus = useCallback(
    async (taskId: string, newStatus: string) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      )
      await supabase
        .from("tasks")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", taskId)
    },
    [supabase]
  )

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, column: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverColumn(column)
  }

  const handleDragLeave = () => setDragOverColumn(null)

  const handleDrop = (e: React.DragEvent, column: string) => {
    e.preventDefault()
    setDragOverColumn(null)
    const taskId = e.dataTransfer.getData("text/plain")
    if (taskId) updateTaskStatus(taskId, column)
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => setIsCreating(true)} size="sm">
          <Plus className="mr-1 h-4 w-4" />
          新增任務
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.key)
          return (
            <div
              key={col.key}
              onDragOver={(e) => handleDragOver(e, col.key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.key)}
              className={`rounded-lg p-3 min-h-[200px] transition-colors ${col.color} ${
                dragOverColumn === col.key ? "ring-2 ring-primary" : ""
              }`}
            >
              <div className="mb-3 flex items-center gap-2">
                <h3 className="font-semibold text-sm">{col.label}</h3>
                <Badge variant="outline" className="text-xs">
                  {columnTasks.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDragStart={handleDragStart}
                    onClick={(t) => setSelectedTask(t)}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Create Dialog */}
      <TaskFormDialog
        open={isCreating}
        onOpenChange={setIsCreating}
        onSuccess={(task) => setTasks((prev) => [task, ...prev])}
      />

      {/* Edit Dialog */}
      <TaskFormDialog
        open={!!selectedTask}
        onOpenChange={(open) => { if (!open) setSelectedTask(null) }}
        task={selectedTask}
        onSuccess={(updated) =>
          setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
        }
        onDelete={(id) => setTasks((prev) => prev.filter((t) => t.id !== id))}
      />
    </>
  )
}
