import { ChevronRight } from "lucide-react"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "../ui/button"

interface EventCardProps {
  title: string
  image: string
  ticketsSold: number
  totalTickets: number
  venueRevenue: number
  rechargeRevenue: number
  scannedTickets: number
  pendingTickets: number
}

export function EventCard({
  title,
  image,
  ticketsSold,
  totalTickets,
  venueRevenue,
  rechargeRevenue,
  scannedTickets,
  pendingTickets,
}: EventCardProps) {
  const soldPercentage = (ticketsSold / totalTickets) * 100

  return (
    <Card className="w-full">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          Publié
          <ChevronRight className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-0">
        <div className="relative h-40 w-full rounded-xl">
          <Image 
            src={image || "/images/auth.png"} 
            alt={title} 
            fill 
            className="object-cover rounded-xl px-2"
          />
        </div>
        <div className="space-y-2 px-6 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Ticket vendu</h4>
            <span className="text-lg font-semibold">${(ticketsSold * 500).toLocaleString()}.00</span>
          </div>
          <div className="space-y-1">
            <Progress value={soldPercentage} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {ticketsSold}/{totalTickets} Sales
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <p className="text-sm text-muted-foreground">Ventes sur place</p>
              <p className="text-lg font-semibold">${venueRevenue.toLocaleString()}.00</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Recharge</p>
              <p className="text-lg font-semibold">${rechargeRevenue.toLocaleString()}.00</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between border-t px-6 py-3">
        <Button className="flex items-center bg-white gap-2 shadow-sm text-black hover:bg-white">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-sm">Ticket Scannés : {scannedTickets}</span>
        </Button>
        <Button className="flex items-center bg-white gap-2 shadow-sm text-black hover:bg-white">
          <span className="h-2 w-2 rounded-full bg-yellow-400" />
          <span className="text-sm">Ticket en attente : {pendingTickets}</span>
        </Button>
      </CardFooter>
    </Card>
  )
}