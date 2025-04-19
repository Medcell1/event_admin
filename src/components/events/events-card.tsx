"use client"
import { ChevronRight, Calendar,  Clock } from "lucide-react"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/constants/routes"

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1).replace(/\.0$/, "")}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`
  }
  return num.toString()
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

interface EventCardProps {
  title: string
  image: string
  ticketsSold: number
  totalTickets: number
  scannedTickets: number
  pendingTickets: number
  description?: string
  location?: string
  visibility?: "public" | "private"
  date?: string
  id?: string
}

export function EventCard({
  title,
  image,
  ticketsSold,
  totalTickets,
  scannedTickets,
  pendingTickets,
  description,
  location,
  visibility,
  date,
  id,
}: EventCardProps) {
  const soldPercentage = Math.ceil((ticketsSold / totalTickets) * 100)
  
  const getTimeRemaining = () => {
    if (!date) return null

    const eventDate = new Date(date)
    const now = new Date()
    const diff = eventDate.getTime() - now.getTime()

    if (diff <= 0) return "Événement terminé"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const months = Math.floor(days / 30)

    if (months > 0) return `Dans ${months} mois`
    if (days > 0) return `Dans ${days} jour${days > 1 ? "s" : ""}`
    return `Dans ${hours} heure${hours > 1 ? "s" : ""}`
  }

  const timeRemaining = date ? getTimeRemaining() : null
  const router = useRouter();
  
  return (
    <Card onClick={()=> router.push(ROUTES.DASHBOARD.EVENTS.VIEW(id!))} className="w-full overflow-hidden">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-lg font-semibold truncate">{title}</h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground shrink-0">
          Publié
          <ChevronRight className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-0">
        <div className="relative h-40 w-full">
          <Image src={image || "/images/auth.png"} alt={title} fill className="object-cover px-2" />

          {date && (
            <div className="absolute top-2 left-4 bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(date)}
            </div>
          )}

          {timeRemaining && (
            <div className="absolute bottom-2 right-4 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeRemaining}
            </div>
          )}
        </div>

        <div className="space-y-2 px-6 pt-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{soldPercentage}%</h4>
            <p className="text-sm text-muted-foreground">
              {formatNumber(ticketsSold)}/{formatNumber(totalTickets)} Sales
            </p>
          </div>
          <div className="pb-2">
            <Progress value={soldPercentage} className="h-2" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between border-t px-6 py-3">
        <div className="flex w-full justify-between space-x-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-1 text-xs h-auto py-1.5 flex-1 min-w-0" 
            size="sm"
          >
            <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
            <span className="truncate">Ticket Scannés: {formatNumber(scannedTickets)}</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-1 text-xs h-auto py-1.5 flex-1 min-w-0" 
            size="sm"
          >
            <span className="h-2 w-2 rounded-full bg-yellow-400 flex-shrink-0" />
            <span className="truncate">Ticket en attente: {formatNumber(pendingTickets)}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}