"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { teamService } from "@/lib/services/team-service"
import type { Team, TeamMember } from "@/lib/types"
import { ArrowLeft, Users, FolderKanban } from "lucide-react"
import Link from "next/link"

export default function TeamDetailPage() {
  const params = useParams()
  const router = useRouter()
  const teamId = Number(params.id)
  const [team, setTeam] = useState<Team | null>(null)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        const [teamData, membersData] = await Promise.all([
          teamService.getTeam(teamId),
          teamService.getTeamMembers(teamId),
        ])
        setTeam(teamData)
        setMembers(membersData)
      } catch (error) {
        console.error("Failed to load team:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTeamData()
  }, [teamId])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    )
  }

  if (!team) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Team not found</h2>
          <Button asChild className="mt-4">
            <Link href="/teams">Back to Teams</Link>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/teams">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
            <p className="text-muted-foreground">{team.description || "No description"}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
              </CardTitle>
              <CardDescription>{members.length} members in this team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{member.user.name}</p>
                      <p className="text-sm text-muted-foreground">{member.user.email}</p>
                    </div>
                    <Badge variant={member.role === "admin" ? "default" : "secondary"}>{member.role}</Badge>
                  </div>
                ))}
                {members.length === 0 && <p className="text-sm text-muted-foreground">No members yet</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5" />
                Projects
              </CardTitle>
              <CardDescription>Projects in this team</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No projects yet</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
