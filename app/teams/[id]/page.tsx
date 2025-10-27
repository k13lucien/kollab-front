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
import { useAuth } from "@/contexts/auth-context"

export default function TeamDetailPage() {
  const params = useParams()
  const router = useRouter()
  const teamId = Number(params.id)
  const [team, setTeam] = useState<Team | null>(null)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [addMemberLoading, setAddMemberLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState<number|null>(null);
  const userIsLeader = !!team && !!user && (team as any).leader_id === user.id;

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return;
    setAddMemberLoading(true);
    try {
      await teamService.addTeamMemberByEmail(teamId, newMemberEmail)
      setNewMemberEmail("")
      const membersData = await teamService.getTeamMembers(teamId)
      setMembers(membersData)
    } catch (err) {
      console.error("Échec de l'ajout du membre:", err)
    } finally {
      setAddMemberLoading(false)
    }
  };
  const handleRemoveMember = async (userId: number) => {
    if (!team) return;
    setRemoveLoading(userId);
    try {
      await teamService.removeTeamMember(teamId, userId)
      const membersData = await teamService.getTeamMembers(teamId)
      setMembers(membersData)
    } catch (err) {
      console.error("Échec du retrait du membre:", err)
    } finally {
      setRemoveLoading(null)
    }
  }

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        const [teamData/*, membersData*/] = await Promise.all([
          teamService.getTeam(teamId),
          /*teamService.getTeamMembers(teamId),*/
        ])
        setTeam(teamData)
        // setMembers(membersData)
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
          <h2 className="text-2xl font-bold">Équipe introuvable</h2>
          <Button asChild className="mt-4">
            <Link href="/teams">Retour aux équipes</Link>
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
            <p className="text-muted-foreground">{team.description || "Aucune description"}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Membres de l'équipe
              </CardTitle>
              <CardDescription>{members.length} membre(s) dans cette équipe</CardDescription>
              {userIsLeader && (
                <form onSubmit={handleAddMember} className="mt-4 flex gap-2 items-end">
                  <div>
                    <label htmlFor="member-email" className="block text-sm">Ajouter un membre par email</label>
                    <input id="member-email" type="email" value={newMemberEmail} onChange={e=>setNewMemberEmail(e.target.value)} required disabled={addMemberLoading} className="border p-1 rounded text-sm" placeholder="email@exemple.com" />
                  </div>
                  <Button type="submit" disabled={addMemberLoading||!newMemberEmail} className="h-9">{addMemberLoading ? "Ajout en cours..." : "Ajouter"}</Button>
                </form>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {member.user.name}
                        {member.role === "leader" && <Badge variant="default">Leader</Badge>}
                        {member.role === "admin" && <Badge variant="default">Leader</Badge>}
                        {member.role !== "admin" && member.role !== "leader" && <Badge variant="secondary">Membre</Badge>}
                      </p>
                      <p className="text-sm text-muted-foreground">{member.user.email}</p>
                    </div>
                    {userIsLeader && member.role !== "admin" && member.role !== "leader" && (
                      <Button size="sm" variant="destructive" onClick={() => handleRemoveMember(member.user.id)} disabled={removeLoading === member.user.id}>
                        {removeLoading === member.user.id ? "Retrait..." : "Retirer"}
                      </Button>
                    )}
                  </div>
                ))}
                {members.length === 0 && <p className="text-sm text-muted-foreground">Aucun membre pour le moment</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5" />
                Projets
              </CardTitle>
              <CardDescription>Projets dans cette équipe</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Aucun projet pour le moment</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
