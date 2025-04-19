"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"

import AddContributorModal from "./add-contributor-modal"
import ChangePasswordModal from "./change-password-modal"
import TeamMemberCard from "./team-member-card"
import CredentialsDisplay from "./credentials-display"
import CollaboratorService from "@/actions/team"
import type { Contributor } from "@/@types"

export default function TeamManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContributor, setSelectedContributor] = useState<Contributor | null>(null)
  const [credentials, setCredentials] = useState<{ username?: string; password?: string } | null>(null)

  const itemsPerPage = 6

  useEffect(() => {
    fetchContributors()
  }, [])

  const fetchContributors = async () => {
    setLoading(true)
    try {
      const response = await CollaboratorService.getContributors()
      if (response.success && response.contributors) {
        setContributors(response.contributors)
      } else {
        toast.error("Error Fetching Contributors", {
          description: response.message || "Failed to fetch contributors",
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "An unexpected error occurred",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddContributor = async (name: string) => {
    try {
      const response = await CollaboratorService.createCollaborator({ name })
      if (response.success) {
        toast.success("Success", {
          description: "Contributor created successfully",
        })
        setCredentials({
          username: response.user?.name,
          password: response.credentials?.password,
        })
        fetchContributors()
        setIsAddModalOpen(false)
      } else {
        toast.error("Error", {
          description: response.message || "Failed to create contributor",
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "An unexpected error occurred",
      })
    }
  }

  const handleChangePassword = async (name: string) => {
    try {
      const response = await CollaboratorService.changePassword({ name })
      if (response.success) {
        toast.success("Success", {
          description: "Password changed successfully",
        })
        setCredentials({
          username: name,
          password: response.credentials?.password,
        })
        setIsPasswordModalOpen(false)
      } else {
        toast.error("Error", {
          description: response.message || "Failed to change password",
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "An unexpected error occurred",
      })
    }
  }

  const openChangePasswordModal = (contributor: Contributor) => {
    setSelectedContributor(contributor)
    setIsPasswordModalOpen(true)
  }

  const clearCredentials = () => {
    setCredentials(null)
  }

  const filteredContributors = contributors.filter((contributor) =>
    contributor.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const paginatedContributors = filteredContributors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-6">
      <Card className="border-none">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Team Management</h1>
              <p className="text-muted-foreground">Manage your team contributors and their access</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center border rounded-md px-3 py-2">
                <Search className="h-4 w-4 text-muted-foreground mr-2" />
                <Input
                  placeholder="Search contributors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Contributor
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {credentials && <CredentialsDisplay credentials={credentials} onClose={clearCredentials} />}

      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Contributors</h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : contributors.length === 0 ? (
            <Alert>
              <AlertDescription>No contributors found. Add your first contributor to get started.</AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedContributors.map((contributor) => (
                <TeamMemberCard
                  key={contributor.id}
                  member={contributor}
                  onChangePassword={() => openChangePasswordModal(contributor)}
                />
              ))}
            </div>
          )}

          {!loading && contributors.length > 0 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredContributors.length / itemsPerPage)}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <AddContributorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddContributor}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        contributor={selectedContributor}
        onSubmit={handleChangePassword}
      />
    </div>
  )
}