import { apiClient } from "@/lib/api-client"
import type { User, LoginCredentials, RegisterData, ApiResponse } from "@/lib/types"

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await apiClient.post<{ user: User; token: string }>("/login", credentials)
    apiClient.setToken(response.token)
    if (typeof window !== "undefined") {
      document.cookie = `auth_token=${response.token}; path=/`
    }
    return response
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const response = await apiClient.post<ApiResponse<{ user: User; token: string }>>("/register", data)
    apiClient.setToken(response.data.token)
    return response.data
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/logout")
    } finally {
      apiClient.clearToken()
    if (typeof window !== "undefined") {
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    }
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>("/user")
    return response.data
  },
}
