"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { TaskCard } from "@/components/tasks/task-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { taskService } from "@/lib/services/task-service"
import type { Task } from "@/lib/types"
import { Spinner } from "@/components/ui/spinner"
import { Empty } from "@/components/ui/empty"
import { CheckSquare } from "lucide-react"
import { PermissionGuard } from "@/components/auth/permission-guard"

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  const loadTasks = async () => {
    try {
      const data = await taskService.getTasks()
      setTasks(data)
    } catch (error) {
      console.error("Failed to load tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const filterTasks = (status?: string) => {
    if (!status || status === "all") return tasks
    return tasks.filter((task) => task.status === status)
  }

  const renderTaskList = (filteredTasks: Task[]) => {
    if (filteredTasks.length === 0) {
      return (
        <Empty
          icon={CheckSquare}
          title="No tasks found"
          description="Create your first task to start tracking your work"
          action={
            <PermissionGuard permission="tasks.create">
              <CreateTaskDialog onTaskCreated={loadTasks} />
            </PermissionGuard>
          }
        />
      )
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} onTaskUpdated={loadTasks} />
        ))}
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground">Manage and track your tasks</p>
          </div>
          <PermissionGuard permission="tasks.create">
            <CreateTaskDialog onTaskCreated={loadTasks} />
          </PermissionGuard>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({filterTasks("pending").length})</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress ({filterTasks("in_progress").length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({filterTasks("completed").length})</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              {renderTaskList(tasks)}
            </TabsContent>
            <TabsContent value="pending" className="mt-6">
              {renderTaskList(filterTasks("pending"))}
            </TabsContent>
            <TabsContent value="in_progress" className="mt-6">
              {renderTaskList(filterTasks("in_progress"))}
            </TabsContent>
            <TabsContent value="completed" className="mt-6">
              {renderTaskList(filterTasks("completed"))}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  )
}
