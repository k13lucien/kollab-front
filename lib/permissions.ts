import type { User } from "./types"

export type Permission =
  | "teams.create"
  | "teams.update"
  | "teams.delete"
  | "teams.view"
  | "projects.create"
  | "projects.update"
  | "projects.delete"
  | "projects.view"
  | "tasks.create"
  | "tasks.update"
  | "tasks.delete"
  | "tasks.view"
  | "tasks.assign"
  | "members.add"
  | "members.remove"

const rolePermissions: Record<User["role"], Permission[]> = {
  admin: [
    "teams.create",
    "teams.update",
    "teams.delete",
    "teams.view",
    "projects.create",
    "projects.update",
    "projects.delete",
    "projects.view",
    "tasks.create",
    "tasks.update",
    "tasks.delete",
    "tasks.view",
    "tasks.assign",
    "members.add",
    "members.remove",
  ],
  manager: [
    "teams.view",
    "projects.create",
    "projects.update",
    "projects.view",
    "tasks.create",
    "tasks.update",
    "tasks.delete",
    "tasks.view",
    "tasks.assign",
    "members.add",
  ],
  member: [
    "teams.view", 
    "teams.update", 
    "teams.delete",
    "projects.view", 
    "projects.update", 
    "projects.delete",
    "tasks.create", 
    "tasks.update", 
    "tasks.delete", 
    "tasks.view"
  ],
}

export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false
  return rolePermissions[user.role]?.includes(permission) ?? false
}

export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false
  return permissions.some((permission) => hasPermission(user, permission))
}

export function hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false
  return permissions.every((permission) => hasPermission(user, permission))
}

export function canManageTeam(user: User | null): boolean {
  return hasAnyPermission(user, ["teams.create", "teams.update", "teams.delete"])
}

export function canManageProject(user: User | null): boolean {
  return hasAnyPermission(user, ["projects.create", "projects.update", "projects.delete"])
}

export function canManageTask(user: User | null): boolean {
  return hasAnyPermission(user, ["tasks.create", "tasks.update", "tasks.delete"])
}
