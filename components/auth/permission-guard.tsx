"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"
import { hasPermission, hasAnyPermission, type Permission } from "@/lib/permissions"

interface PermissionGuardProps {
  children: ReactNode
  permission?: Permission
  permissions?: Permission[]
  requireAll?: boolean
  fallback?: ReactNode
}

export function PermissionGuard({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null,
}: PermissionGuardProps) {
  const { user } = useAuth()

  // Debug: afficher les infos utilisateur
  console.log("PermissionGuard - User:", user)
  console.log("PermissionGuard - Permission:", permission)
  console.log("PermissionGuard - Permissions:", permissions)

  let hasAccess = false

  if (permission) {
    hasAccess = hasPermission(user, permission)
  } else if (permissions) {
    if (requireAll) {
      hasAccess = permissions.every((p) => hasPermission(user, p))
    } else {
      hasAccess = hasAnyPermission(user, permissions)
    }
  }

  console.log("PermissionGuard - HasAccess:", hasAccess)

  // TEMPORAIRE: autoriser tout si pas d'utilisateur (pour debug)
  if (!user) {
    console.log("PermissionGuard - No user, allowing access for debug")
    return <>{children}</>
  }

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
