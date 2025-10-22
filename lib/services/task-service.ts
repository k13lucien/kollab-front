import { apiClient } from "@/lib/api-client"
import type { Task, CreateTaskData, ApiResponse } from "@/lib/types"

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const response = await apiClient.get<ApiResponse<Task[]> | Task[]>("/tasks")
    // @ts-expect-error tolérance format
    return (response as any)?.data ?? (response as any) ?? []
  },

  async getTask(id: number): Promise<Task> {
    const response = await apiClient.get<ApiResponse<Task> | Task>(`/tasks/${id}`)
    // @ts-expect-error tolérance format
    return (response as any)?.data ?? (response as any)
  },

  async getProjectTasks(projectId: number): Promise<Task[]> {
    const response = await apiClient.get<ApiResponse<Task[]> | Task[]>(`/projects/${projectId}/tasks`)
    // @ts-expect-error tolérance format
    return (response as any)?.data ?? (response as any) ?? []
  },

  async createTask(data: CreateTaskData): Promise<Task> {
    const response = await apiClient.post<ApiResponse<Task> | Task>("/tasks", data)
    // @ts-expect-error tolérance format
    return (response as any)?.data ?? (response as any)
  },

  async updateTask(id: number, data: Partial<CreateTaskData>): Promise<Task> {
    const response = await apiClient.put<ApiResponse<Task> | Task>(`/tasks/${id}`, data)
    // @ts-expect-error tolérance format
    return (response as any)?.data ?? (response as any)
  },

  async deleteTask(id: number): Promise<void> {
    await apiClient.delete(`/tasks/${id}`)
  },
}
