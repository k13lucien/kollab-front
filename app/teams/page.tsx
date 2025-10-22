"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CreateTeamDialog } from "@/components/teams/create-team-dialog"
import { TeamCard } from "@/components/teams/team-card"
import { teamService } from "@/lib/services/team-service"
import type { Team } from "@/lib/types"
import { Spinner } from "@/components/ui/spinner"
import { Empty } from "@/components/ui/empty"
import { Users } from "lucide-react"
import { PermissionGuard } from "@/components/auth/permission-guard"

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadTeams = async () => {
    try {
      const data = await teamService.getTeams()
      setTeams(data || [])
    } catch (error) {
      console.error("Failed to load teams:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTeams()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Équipes</h1>
            <p className="text-muted-foreground">Gérez vos équipes et collaborez avec d'autres</p>
          </div>
          <PermissionGuard permission="teams.create">
            <CreateTeamDialog onTeamCreated={loadTeams} />
          </PermissionGuard>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : teams.length === 0 ? (
          <>
            <Empty
              icon={Users}
              title="Aucune équipe pour le moment"
              description="Créez votre première équipe pour commencer à collaborer avec d'autres"
            />
            <div className="mt-4 flex justify-center">
              <PermissionGuard permission="teams.create">
                <CreateTeamDialog onTeamCreated={loadTeams} />
              </PermissionGuard>
            </div>
          </>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} onTeamUpdated={loadTeams} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
