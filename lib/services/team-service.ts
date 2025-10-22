import { apiClient } from "@/lib/api-client"
import type { Team, TeamMember, CreateTeamData, ApiResponse } from "@/lib/types"

export const teamService = {
  async getTeams(): Promise<Team[]> {
    const response = await apiClient.get<ApiResponse<Team[]>>("/teams")
    return response.data
  },

  async getTeam(id: number): Promise<Team> {
    const response = await apiClient.get<ApiResponse<Team>>(`/teams/${id}`)
    return response.data
  },

  async createTeam(data: CreateTeamData): Promise<Team> {
    const response = await apiClient.post<ApiResponse<Team>>("/teams", data)
    return response.data
  },

  async updateTeam(id: number, data: Partial<CreateTeamData>): Promise<Team> {
    const response = await apiClient.put<ApiResponse<Team>>(`/teams/${id}`, data)
    return response.data
  },

  async deleteTeam(id: number): Promise<void> {
    await apiClient.delete(`/teams/${id}`)
  },

  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    const response = await apiClient.get<ApiResponse<TeamMember[]>>(`/teams/${teamId}/members`)
    return response.data
  },

  async addTeamMember(teamId: number, userId: number, role: "admin" | "member"): Promise<TeamMember> {
    const response = await apiClient.post<ApiResponse<TeamMember>>(`/teams/${teamId}/members`, {
      user_id: userId,
      role,
    })
    return response.data
  },

  async removeTeamMember(teamId: number, userId: number): Promise<void> {
    await apiClient.delete(`/teams/${teamId}/members/${userId}`)
  },
}
