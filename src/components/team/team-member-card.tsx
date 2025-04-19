"use client"

import { Key, UserCog } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Contributor } from "@/@types"

interface TeamMemberCardProps {
  member: Contributor
  onChangePassword: (member: Contributor) => void
}

export default function TeamMemberCard({ member, onChangePassword }: TeamMemberCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">{getInitials(member.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate">{member.name}</h3>
            <p className="text-sm text-muted-foreground">Contributor</p>
            <div className="flex items-center mt-1">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
              <span className="text-xs text-muted-foreground">Active</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 p-4 flex justify-between">
        <Button variant="outline" size="sm" className="gap-1" onClick={() => onChangePassword(member)}>
          <Key className="h-3.5 w-3.5" />
          Reset Password
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <UserCog className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onChangePassword(member)}>Change Password</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Remove Access</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}
