"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { teamService } from "@/lib/services/team-service"
import type { Team } from "@/lib/types"

interface DeleteTeamDialogProps {
  team: Team
  open: boolean
  onOpenChange: (open: boolean) => void
  onTeamDeleted?: () => void
}

export function DeleteTeamDialog({ team, open, onOpenChange, onTeamDeleted }: DeleteTeamDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      await teamService.deleteTeam(team.id)
      toast({
        title: "Succès",
        description: "Équipe supprimée avec succès",
      })
      onOpenChange(false)
      onTeamDeleted?.()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Échec de la suppression de l'équipe",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Ceci supprimera définitivement l'équipe "{team.name}" ainsi que tous les projets et tâches associés. Cette action ne peut pas être annulée.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Suppression..." : "Supprimer l'équipe"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
