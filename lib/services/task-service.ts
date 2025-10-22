import { apiClient } from "@/lib/api-client"
import type { Task, CreateTaskData, ApiResponse } from "@/lib/types"

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const response = await apiClient.get<ApiResponse<Task[]>>("/tasks")
    return response.data
  },

  async getTask(id: number): Promise<Task> {
    const response = await apiClient.get<ApiResponse<Task>>(`/tasks/${id}`)
    return response.data
  },

  async getProjectTasks(projectId: number): Promise<Task[]> {
    const response = await apiClient.get<ApiResponse<Task[]>>(`/projects/${projectId}/tasks`)
    return response.data
  },

  async createTask(data: CreateTaskData): Promise<Task> {
    const response = await apiClient.post<ApiResponse<Task>>("/tasks", data)
    return response.data
  },

  async updateTask(id: number, data: Partial<CreateTaskData>): Promise<Task> {
    const response = await apiClient.put<ApiResponse<Task>>(`/tasks/${id}`, data)
    return response.data
  },

  async deleteTask(id: number): Promise<void> {
    await apiClient.delete(`/tasks/${id}`)
  },
}
