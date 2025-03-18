import { ChevronRight } from "lucide-react"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1).replace(/\.0$/, "")}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`
  }
  return num.toString()
}

interface EventCardProps {
  title: string
  image: string
  ticketsSold: number
  totalTickets: number
  scannedTickets: number
  pendingTickets: number
}

export function EventCard({ title, image, ticketsSold, totalTickets, scannedTickets, pendingTickets }: EventCardProps) {
  const soldPercentage = (ticketsSold / totalTickets) * 100

  return (
    <Card className="w-full">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-lg font-semibold truncate">{title}</h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground shrink-0">
          Publié
          <ChevronRight className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-0">
        <div className="relative h-40 w-full rounded-xl">
          <Image src={image || "/images/auth.png"} alt={title} fill className="object-cover rounded-xl px-2" />
        </div>
        <div className="space-y-2 px-6 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Ticket vendu</h4>
            <span className="text-lg font-semibold">${(ticketsSold * 500).toLocaleString()}.00</span>
          </div>
          <div className="space-y-1">
            <Progress value={soldPercentage} className="h-2" />
            <p className="text-sm text-muted-foreground p-1">
              {formatNumber(ticketsSold)}/{formatNumber(totalTickets)} Sales
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between border-t px-6 py-3 flex-wrap gap-2">
        <Button variant="outline" className="flex items-center gap-2 text-xs sm:text-sm h-auto py-1.5" size="sm">
          <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
          <span>Ticket Scannés: {formatNumber(scannedTickets)}</span>
        </Button>
        <Button variant="outline" className="flex items-center gap-2 text-xs sm:text-sm h-auto py-1.5" size="sm">
          <span className="h-2 w-2 rounded-full bg-yellow-400 flex-shrink-0" />
          <span>Ticket en attente: {formatNumber(pendingTickets)}</span>
        </Button>
      </CardFooter>
    </Card>
  )
}

