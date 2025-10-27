"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { taskService } from "@/lib/services/task-service"
import { projectService } from "@/lib/services/project-service"
import type { Project } from "@/lib/types"
import { Plus } from "lucide-react"

interface CreateTaskDialogProps {
  onTaskCreated?: () => void
  defaultProjectId?: number
}

export function CreateTaskDialog({ onTaskCreated, defaultProjectId }: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [projectId, setProjectId] = useState<string>(defaultProjectId?.toString() || "")
  const [status, setStatus] = useState<"pending" | "in_progress" | "completed">("pending")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [deadline, setDeadline] = useState("") // Renommé dueDate en deadline
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await projectService.getProjects()
        setProjects(data)
      } catch (error) {
        console.error("Failed to load projects:", error)
      }
    }
    if (open) {
      loadProjects()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!projectId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner un projet",
      })
      return
    }

    setIsLoading(true)

    try {
      await taskService.createTask({
        title,
        description: description || undefined,
        project_id: Number(projectId),
        status,
        priority,
        deadline: deadline || undefined, // Renommé due_date en deadline
      })
      toast({
        title: "Succès",
        description: "Tâche créée avec succès",
      })
      setOpen(false)
      setTitle("")
      setDescription("")
      setProjectId(defaultProjectId?.toString() || "")
      setStatus("pending")
      setPriority("medium")
      setDeadline("") // Réinitialisé deadline
      onTaskCreated?.()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Échec de la création de la tâche",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Créer une tâche
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Créer une nouvelle tâche</DialogTitle>
            <DialogDescription>Créez une nouvelle tâche dans un projet pour suivre votre travail.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de la tâche</Label>
              <Input
                id="title"
                placeholder="Implémenter l'authentification utilisateur"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Textarea
                id="description"
                placeholder="Décrivez la tâche..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project">Projet</Label>
              <Select value={projectId} onValueChange={setProjectId} disabled={isLoading || !!defaultProjectId}>
                <SelectTrigger id="project">
                  <SelectValue placeholder="Sélectionnez un projet" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select value={status} onValueChange={(value: any) => setStatus(value)} disabled={isLoading}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="in_progress">En cours</SelectItem>
                    <SelectItem value="completed">Terminée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priorité</Label>
                <Select value={priority} onValueChange={(value: any) => setPriority(value)} disabled={isLoading}>
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Date limite (optionnel)</Label> {/* Renommé Label et htmlFor */}
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Création en cours..." : "Créer la tâche"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
