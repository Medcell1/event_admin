"use client"

import { useState } from "react"
import { Plus, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Pagination } from "@/components/ui/pagination"
import AddEditMemberModal from "./team-action-modal"
import TeamMemberCard from "./team-member-card"
import TeamMemberTable from "./team-member-table"

// Mock data for team members
const mockTeamMembers = [
  { id: 1, name: "John Doe", role: "Developer", image: "/placeholder.svg?height=100&width=100" },
  { id: 2, name: "Jane Smith", role: "Designer", image: "/placeholder.svg?height=100&width=100" },
  { id: 3, name: "Mike Johnson", role: "Manager", image: "/placeholder.svg?height=100&width=100" },
  // Add more mock data as needed
]

export default function TeamManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  const itemsPerPage = 6

  const filteredMembers = mockTeamMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const paginatedMembers = filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-6">
      <div className="px-10 py-6 bg-white w-full rounded-lg flex flex-row justify-between items-center shadow-sm">
        <h1 className="text-xl font-semibold">Team Members</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={() => setViewMode("grid")}>
            <Grid className={`h-4 w-4 ${viewMode === "grid" ? "text-primary" : ""}`} />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setViewMode("table")}>
            <List className={`h-4 w-4 ${viewMode === "table" ? "text-primary" : ""}`} />
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Member
          </Button>
        </div>
      </div>
      <div className="px-10">
        <Input
          placeholder="Search team members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="px-10">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <TeamMemberTable members={paginatedMembers} />
        )}
      </div>
      <div className="px-10">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredMembers.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>
      <AddEditMemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

