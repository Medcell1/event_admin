import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface TeamMember {
  id: number
  name: string
  role: string
  image: string
}

interface TeamMemberTableProps {
  members: TeamMember[]
}

export default function TeamMemberTable({ members }: TeamMemberTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell>
              <Image
                src={member.image || "/placeholder.svg"}
                alt={member.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            </TableCell>
            <TableCell className="font-medium">{member.name}</TableCell>
            <TableCell>{member.role}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

