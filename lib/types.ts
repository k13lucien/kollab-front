// Core User and Auth Types
export interface User {
  id: number
  name: string
  email: string
  role: "admin" | "manager" | "member"
  created_at: string
  updated_at: string
}

export interface Team {
  id: number
  name: string
  description: string | null
  created_at: string
  updated_at: string
  members_count?: number
}

export interface Project {
  id: number
  name: string
  description: string | null
  team_id: number
  team?: Team
  status: "active" | "completed" | "archived"
  created_at: string
  updated_at: string
  tasks_count?: number
}

export interface Task {
  id: number
  title: string
  description: string | null
  project_id: number
  project?: Project
  assigned_to: number | null
  assigned_user?: User
  status: "pending" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
  due_date: string | null
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: number
  team_id: number
  user_id: number
  user: User
  role: "admin" | "member"
  joined_at: string
}

// API Request/Response Types
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface CreateTeamData {
  name: string
  description?: string
}

export interface CreateProjectData {
  name: string
  label?: string // Remplacé description par label
  deadline?: string // Ajout du champ deadline
  team_id: number
  // status?: "active" | "completed" | "archived" // Supprimé
}

export interface CreateTaskData {
  title: string
  description?: string
  project_id: number
  assigned_to?: number
  status?: "pending" | "in_progress" | "completed"
  priority?: "low" | "medium" | "high"
  due_date?: string
}
