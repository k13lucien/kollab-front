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
import { projectService } from "@/lib/services/project-service"
import { teamService } from "@/lib/services/team-service"
import type { Team } from "@/lib/types"
import { Plus } from "lucide-react"

interface CreateProjectDialogProps {
  onProjectCreated?: () => void
  defaultTeamId?: number
}

export function CreateProjectDialog({ onProjectCreated, defaultTeamId }: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [teamId, setTeamId] = useState<string>(defaultTeamId?.toString() || "")
  const [status, setStatus] = useState<"active" | "completed" | "archived">("active")
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const data = await teamService.getTeams()
        setTeams(data)
      } catch (error) {
        console.error("Failed to load teams:", error)
      }
    }
    if (open) {
      loadTeams()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!teamId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner une équipe",
      })
      return
    }

    setIsLoading(true)

    try {
      await projectService.createProject({
        name,
        description: description || undefined,
        team_id: Number(teamId),
        status,
      })
      toast({
        title: "Succès",
        description: "Projet créé avec succès",
      })
      setOpen(false)
      setName("")
      setDescription("")
      setTeamId(defaultTeamId?.toString() || "")
      setStatus("active")
      onProjectCreated?.()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Échec de la création du projet",
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
          Créer un projet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Créer un nouveau projet</DialogTitle>
            <DialogDescription>Créez un nouveau projet au sein d'une équipe pour organiser vos tâches.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du projet</Label>
              <Input
                id="name"
                placeholder="Refonte du site web"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Textarea
                id="description"
                placeholder="Décrivez votre projet..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team">Équipe</Label>
              <Select value={teamId} onValueChange={setTeamId} disabled={isLoading || !!defaultTeamId}>
                <SelectTrigger id="team">
                  <SelectValue placeholder="Sélectionnez une équipe" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)} disabled={isLoading}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="archived">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Création en cours..." : "Créer le projet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
