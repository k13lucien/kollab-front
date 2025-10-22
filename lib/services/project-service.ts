import { apiClient } from "@/lib/api-client"
import type { Project, CreateProjectData, ApiResponse } from "@/lib/types"

export const projectService = {
  async getProjects(): Promise<Project[]> {
    const response = await apiClient.get<ApiResponse<Project[]>>("/projects")
    return response.data
  },

  async getProject(id: number): Promise<Project> {
    const response = await apiClient.get<ApiResponse<Project>>(`/projects/${id}`)
    return response.data
  },

  async getTeamProjects(teamId: number): Promise<Project[]> {
    const response = await apiClient.get<ApiResponse<Project[]>>(`/teams/${teamId}/projects`)
    return response.data
  },

  async createProject(data: CreateProjectData): Promise<Project> {
    const response = await apiClient.post<ApiResponse<Project>>("/projects", data)
    return response.data
  },

  async updateProject(id: number, data: Partial<CreateProjectData>): Promise<Project> {
    const response = await apiClient.put<ApiResponse<Project>>(`/projects/${id}`, data)
    return response.data
  },

  async deleteProject(id: number): Promise<void> {
    await apiClient.delete(`/projects/${id}`)
  },
}
