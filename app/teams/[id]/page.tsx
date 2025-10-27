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
  const userIsLeader = !!team && !!user && team.leader_id === user.id;

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return;
    setAddMemberLoading(true);
    try {
      await teamService.addTeamMemberByEmail(teamId, newMemberEmail)
      setNewMemberEmail("")
      // const membersData = await teamService.getTeamMembers(teamId) // Cet appel n'est plus nécessaire
      // setMembers(membersData) // Cet appel n'est plus nécessaire
      // Pour rafraîchir les membres, nous devons recharger l'équipe entière
      const updatedTeam = await teamService.getTeam(teamId);
      if (updatedTeam) {
        setTeam(updatedTeam);
        setMembers(updatedTeam.members || []);
      }
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
      // const membersData = await teamService.getTeamMembers(teamId) // Cet appel n'est plus nécessaire
      // setMembers(membersData) // Cet appel n'est plus nécessaire
      // Pour rafraîchir les membres, nous devons recharger l'équipe entière
      const updatedTeam = await teamService.getTeam(teamId);
      if (updatedTeam) {
        setTeam(updatedTeam);
        setMembers(updatedTeam.members || []);
      }
    } catch (err) {
      console.error("Échec du retrait du membre:", err)
    } finally {
      setRemoveLoading(null)
    }
  }

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        const teamData = await teamService.getTeam(teamId)
        setTeam(teamData)
        setMembers(teamData?.members || [])
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
            <p className="text-muted-foreground">{team.label || "Aucune description"}</p> {/* Changé team.description en team.label */}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Membres de l'équipe
              </CardTitle>
              <CardDescription>{team.members?.length || 0} membre(s) dans cette équipe</CardDescription> {/* Changé members.length en team.members?.length */}
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
                {team.members && team.members.length > 0 ? ( /* Ajout de la condition pour team.members */
                  team.members.map((member) => ( /* Changé members.map en team.members.map */
                    <div key={member.id} className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          {member.name} {/* Accès direct à member.name */}
                          {team.leader_id === member.id && <Badge variant="default">Leader</Badge>}
                          {team.leader_id !== member.id && <Badge variant="secondary">Membre</Badge>} {/* Badge "Membre" par défaut si pas leader */}
                        </p>
                        <p className="text-sm text-muted-foreground">{member.email}</p> {/* Accès direct à member.email */}
                      </div>
                      {userIsLeader && team.leader_id !== member.id && (
                        <Button size="sm" variant="destructive" onClick={() => handleRemoveMember(member.id)} disabled={removeLoading === member.id}>
                          {removeLoading === member.id ? "Retrait..." : "Retirer"}
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Aucun membre pour le moment</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5" />
                Projets
              </CardTitle>
              <CardDescription>{team.projects?.length || 0} projet(s) dans cette équipe</CardDescription> {/* Ajout de team.projects?.length */}
            </CardHeader>
            <CardContent>
              {team.projects && team.projects.length > 0 ? ( /* Ajout de la condition pour team.projects */
                <div className="space-y-3">
                  {team.projects.map((project) => (
                    <Link key={project.id} href={`/projects/${project.id}`} className="block font-medium text-primary hover:underline">
                      {project.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aucun projet pour le moment</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
