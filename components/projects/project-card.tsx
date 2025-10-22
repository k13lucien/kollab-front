"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CheckSquare, MoreVertical, Pencil, Trash2 } from "lucide-react"
import type { Project } from "@/lib/types"
import { EditProjectDialog } from "./edit-project-dialog"
import { DeleteProjectDialog } from "./delete-project-dialog"
import { PermissionGuard } from "@/components/auth/permission-guard"

interface ProjectCardProps {
  project: Project
  onProjectUpdated?: () => void
}

const statusColors = {
  active: "default",
  completed: "secondary",
  archived: "outline",
} as const

export function ProjectCard({ project, onProjectUpdated }: ProjectCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">{project.name}</CardTitle>
                <Badge variant={statusColors[project.status]}>{project.status}</Badge>
              </div>
              <CardDescription className="line-clamp-2">{project.description || "No description"}</CardDescription>
            </div>
            <PermissionGuard permissions={["projects.update", "projects.delete"]}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <PermissionGuard permission="projects.update">
                    <DropdownMenuItem onClick={() => setEditOpen(true)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  </PermissionGuard>
                  <PermissionGuard permission="projects.delete">
                    <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </PermissionGuard>
                </DropdownMenuContent>
              </DropdownMenu>
            </PermissionGuard>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckSquare className="h-4 w-4" />
            <span>{project.tasks_count || 0} tasks</span>
          </div>
          {project.team && (
            <p className="text-sm text-muted-foreground mt-2">
              Team: <span className="font-medium">{project.team.name}</span>
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href={`/projects/${project.id}`}>View Project</Link>
          </Button>
        </CardFooter>
      </Card>

      <EditProjectDialog
        project={project}
        open={editOpen}
        onOpenChange={setEditOpen}
        onProjectUpdated={onProjectUpdated}
      />
      <DeleteProjectDialog
        project={project}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onProjectDeleted={onProjectUpdated}
      />
    </>
  )
}
