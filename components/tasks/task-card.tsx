"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, MoreVertical, Pencil, Trash2 } from "lucide-react"
import type { Task } from "@/lib/types"
import { EditTaskDialog } from "./edit-task-dialog"
import { DeleteTaskDialog } from "./delete-task-dialog"
import { PermissionGuard } from "@/components/auth/permission-guard"

interface TaskCardProps {
  task: Task
  onTaskUpdated?: () => void
}

const statusColors = {
  pending: "outline",
  in_progress: "default",
  completed: "secondary",
} as const

const priorityColors = {
  low: "outline",
  medium: "default",
  high: "destructive",
} as const

export function TaskCard({ task, onTaskUpdated }: TaskCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-lg">{task.title}</CardTitle>
                <Badge variant={statusColors[task.status]}>{task.status.replace("_", " ")}</Badge>
                <Badge variant={priorityColors[task.priority]}>{task.priority}</Badge>
              </div>
              <CardDescription className="line-clamp-2">{task.description || "No description"}</CardDescription>
            </div>
            <PermissionGuard permissions={["tasks.update", "tasks.delete"]}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <PermissionGuard permission="tasks.update">
                    <DropdownMenuItem onClick={() => setEditOpen(true)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  </PermissionGuard>
                  <PermissionGuard permission="tasks.delete">
                    <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </PermissionGuard>
                </DropdownMenuContent>
              </DropdownMenu>
            </PermissionGuard>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            {task.project && (
              <p>
                Project: <span className="font-medium text-foreground">{task.project.name}</span>
              </p>
            )}
            {task.assigned_user && (
              <p>
                Assigned to: <span className="font-medium text-foreground">{task.assigned_user.name}</span>
              </p>
            )}
            {task.due_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Due: {formatDate(task.due_date)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <EditTaskDialog task={task} open={editOpen} onOpenChange={setEditOpen} onTaskUpdated={onTaskUpdated} />
      <DeleteTaskDialog task={task} open={deleteOpen} onOpenChange={setDeleteOpen} onTaskDeleted={onTaskUpdated} />
    </>
  )
}
