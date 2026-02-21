"use client"

import { useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { TaskCard } from "@/components/task-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

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
  const [newTitle, setNewTitle] = useState("")
  const [newNotes, setNewNotes] = useState("")
  const [newDueDate, setNewDueDate] = useState("")
  const [editTitle, setEditTitle] = useState("")
  const [editNotes, setEditNotes] = useState("")
  const [editDueDate, setEditDueDate] = useState("")
  const [editStatus, setEditStatus] = useState("")
  const router = useRouter()
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

  const openDetail = (task: Task) => {
    setSelectedTask(task)
    setEditTitle(task.title)
    setEditNotes(task.notes ?? "")
    setEditDueDate(task.due_date ?? "")
    setEditStatus(task.status)
  }

  const saveDetail = async () => {
    if (!selectedTask) return
    const updates = {
      title: editTitle,
      notes: editNotes || null,
      due_date: editDueDate || null,
      status: editStatus,
      updated_at: new Date().toISOString(),
    }
    await supabase.from("tasks").update(updates).eq("id", selectedTask.id)
    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTask.id ? { ...t, ...updates } : t
      )
    )
    setSelectedTask(null)
  }

  const createTask = async () => {
    if (!newTitle.trim()) return
    const { data } = await supabase
      .from("tasks")
      .insert({
        title: newTitle.trim(),
        notes: newNotes || null,
        due_date: newDueDate || null,
        status: "todo",
        source: "manual",
      })
      .select(`
        id, title, status, due_date, assigned_to, customer_id,
        notes, source, created_at, updated_at,
        customers ( id, name )
      `)
      .single()

    if (data) {
      setTasks((prev) => [data as Task, ...prev])
    }
    setNewTitle("")
    setNewNotes("")
    setNewDueDate("")
    setIsCreating(false)
  }

  const deleteTask = async () => {
    if (!selectedTask) return
    await supabase.from("tasks").delete().eq("id", selectedTask.id)
    setTasks((prev) => prev.filter((t) => t.id !== selectedTask.id))
    setSelectedTask(null)
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
                    onClick={openDetail}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增任務</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>標題</Label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="任務標題"
              />
            </div>
            <div>
              <Label>到期日</Label>
              <Input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
              />
            </div>
            <div>
              <Label>備註</Label>
              <Textarea
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="備註..."
              />
            </div>
            <Button onClick={createTask} className="w-full">
              建立
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>任務詳情</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>標題</Label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div>
              <Label>狀態</Label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">待辦</SelectItem>
                  <SelectItem value="in_progress">進行中</SelectItem>
                  <SelectItem value="done">完成</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>到期日</Label>
              <Input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
              />
            </div>
            <div>
              <Label>備註</Label>
              <Textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
              />
            </div>
            {selectedTask?.customers && (
              <div>
                <Label>關聯客戶</Label>
                <p className="text-sm text-muted-foreground">
                  {Array.isArray(selectedTask.customers)
                    ? selectedTask.customers[0]?.name
                    : selectedTask.customers.name}
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={saveDetail} className="flex-1">
                儲存
              </Button>
              <Button onClick={deleteTask} variant="destructive" size="sm">
                刪除
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
