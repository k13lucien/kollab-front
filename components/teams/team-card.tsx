"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Users, MoreVertical, Pencil, Trash2 } from "lucide-react"
import type { Team } from "@/lib/types"
import { EditTeamDialog } from "./edit-team-dialog"
import { DeleteTeamDialog } from "./delete-team-dialog"
import { PermissionGuard } from "@/components/auth/permission-guard"

interface TeamCardProps {
  team: Team
  onTeamUpdated?: () => void
}

export function TeamCard({ team, onTeamUpdated }: TeamCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl">{team.name}</CardTitle>
              <CardDescription className="line-clamp-2">{team.description || "Aucune description"}</CardDescription>
            </div>
            <PermissionGuard permissions={["teams.update", "teams.delete"]}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <PermissionGuard permission="teams.update">
                    <DropdownMenuItem onClick={() => setEditOpen(true)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Éditer
                    </DropdownMenuItem>
                  </PermissionGuard>
                  <PermissionGuard permission="teams.delete">
                    <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </PermissionGuard>
                </DropdownMenuContent>
              </DropdownMenu>
            </PermissionGuard>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{team.members_count || 0} membre{(team.members_count || 0) > 1 ? "s" : ""}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href={`/teams/${team.id}`}>Voir l'équipe</Link>
          </Button>
        </CardFooter>
      </Card>

      <EditTeamDialog team={team} open={editOpen} onOpenChange={setEditOpen} onTeamUpdated={onTeamUpdated} />
      <DeleteTeamDialog team={team} open={deleteOpen} onOpenChange={setDeleteOpen} onTeamDeleted={onTeamUpdated} />
    </>
  )
}
