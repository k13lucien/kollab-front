import { apiClient } from "@/lib/api-client"
import type { Team, TeamMember, CreateTeamData, ApiResponse } from "@/lib/types"

export const teamService = {
  async getTeams(): Promise<Team[]> {
    const response = await apiClient.get<ApiResponse<Team[]> | Team[]>("/teams")
    // Supporte { data: [...] } ou directement [...]
    // @ts-expect-error tolérance format
    return (response as any)?.data ?? (response as any) ?? []
  },

  async getTeam(id: number): Promise<Team> {
    const response = await apiClient.get<ApiResponse<Team[]> | Team[]>(`/teams/${id}`)
    // @ts-expect-error tolérance format
    const teams = (response as any)?.data ?? (response as any)
    return teams && teams.length > 0 ? teams[0] : null // Retourne la première équipe si la réponse est un tableau, sinon null
  },

  async createTeam(data: CreateTeamData): Promise<Team> {
    const response = await apiClient.post<ApiResponse<Team> | Team>("/teams", data)
    // @ts-expect-error tolérance format
    return (response as any)?.data ?? (response as any)
  },

  async updateTeam(id: number, data: Partial<CreateTeamData>): Promise<Team> {
    const response = await apiClient.put<ApiResponse<Team> | Team>(`/teams/${id}`, data)
    // @ts-expect-error tolérance format
    return (response as any)?.data ?? (response as any)
  },

  async deleteTeam(id: number): Promise<void> {
    await apiClient.delete(`/teams/${id}`)
  },

  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    const response = await apiClient.get<ApiResponse<TeamMember[]> | TeamMember[]>(`/teams/${teamId}/members`)
    // @ts-expect-error tolérance format
    return (response as any)?.data ?? (response as any) ?? []
  },

  async addTeamMember(teamId: number, userId: number, role: "admin" | "member"): Promise<TeamMember> {
    const response = await apiClient.post<ApiResponse<TeamMember> | TeamMember>(`/teams/${teamId}/members`, {
      user_id: userId,
      role,
    })
    // @ts-expect-error tolérance format
    return (response as any)?.data ?? (response as any)
  },

  // Variante conforme à la doc backend: ajout par email
  async addTeamMemberByEmail(teamId: number, email: string): Promise<TeamMember | { message: string }> {
    const response = await apiClient.post<ApiResponse<TeamMember | { message: string }> | (TeamMember | { message: string })>(`/teams/${teamId}/members`, {
      email,
    })
    // @ts-expect-error tolérance format
    return (response as any)?.data ?? (response as any)
  },

  async removeTeamMember(teamId: number, userId: number): Promise<void> {
    await apiClient.delete(`/teams/${teamId}/members/${userId}`)
  },
}
