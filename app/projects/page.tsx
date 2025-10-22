"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { ProjectCard } from "@/components/projects/project-card"
import { projectService } from "@/lib/services/project-service"
import type { Project } from "@/lib/types"
import { Spinner } from "@/components/ui/spinner"
import { Empty } from "@/components/ui/empty"
import { FolderKanban } from "lucide-react"
import { PermissionGuard } from "@/components/auth/permission-guard"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadProjects = async () => {
    try {
      const data = await projectService.getProjects()
      setProjects(data || [])
    } catch (error) {
      console.error("Failed to load projects:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projets</h1>
            <p className="text-muted-foreground">Gérez vos projets et organisez votre travail</p>
          </div>
          <PermissionGuard permission="projects.create">
            <CreateProjectDialog onProjectCreated={loadProjects} />
          </PermissionGuard>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : projects.length === 0 ? (
          <>
            <Empty
              icon={FolderKanban}
              title="Aucun projet pour le moment"
              description="Créez votre premier projet pour organiser vos tâches"
            />
            <div className="mt-4 flex justify-center">
              <PermissionGuard permission="projects.create">
                <CreateProjectDialog onProjectCreated={loadProjects} />
              </PermissionGuard>
            </div>
          </>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onProjectUpdated={loadProjects} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
