import { apiClient } from "@/lib/api-client"
import type { Project, CreateProjectData, ApiResponse } from "@/lib/types"

export const projectService = {
  async getProjects(): Promise<Project[]> {
    const response = await apiClient.get<ApiResponse<Project[]> | Project[]>("/projects")
    // @ts-expect-error tolérance format
    return (response as any)?.data ?? (response as any) ?? []
  },

  async getProject(id: number): Promise<Project> {
    const response = await apiClient.get<ApiResponse<Project> | Project>(`/projects/${id}`)
    // @ts-expect-error tolérance format
    return (response as any)?.data ?? (response as any)
  },

  async getTeamProjects(teamId: number): Promise<Project[]> {
    const response = await apiClient.get<ApiResponse<Project[]> | Project[]>(`/teams/${teamId}/projects`)
    // @ts-expect-error tolérance format
    return (response as any)?.data ?? (response as any) ?? []
  },

  async createProject(data: CreateProjectData): Promise<Project> {
    const response = await apiClient.post<ApiResponse<Project> | Project>("/projects", data)
    // @ts-expect-error tolérance format
    return (response as any)?.data ?? (response as any)
  },

  async updateProject(id: number, data: Partial<CreateProjectData>): Promise<Project> {
    const response = await apiClient.put<ApiResponse<Project> | Project>(`/projects/${id}`, data)
    // @ts-expect-error tolérance format
    return (response as any)?.data ?? (response as any)
  },

  async deleteProject(id: number): Promise<void> {
    await apiClient.delete(`/projects/${id}`)
  },
}
