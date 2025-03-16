import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserIcon } from "lucide-react"

interface TeamMember {
  id: number
  name: string
  role: string
  image: string
}

export default function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-3 flex items-center gap-3">
        <div className="h-12 w-12 relative rounded-full overflow-hidden flex-shrink-0">
          {member.image ? (
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="bg-muted h-full w-full flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-medium text-primary truncate">{member.name}</h3>
          <p className="text-xs text-muted-foreground">{member.role}</p>
        </div>
        <Button variant="ghost" size="sm" className="ml-auto p-0 h-8 w-8">
          <span className="sr-only">Edit</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </Button>
      </CardContent>
    </Card>
  )
}