"use client"

import { useState, useEffect } from "react"
import { format, parseISO, addHours, isAfter, isBefore } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Calendar,
  Clock,
  Filter,
  MapPin,
  QrCode,
  Search,
  Settings,
  Ticket,
  User,
  Users,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TodayEvent } from "@/@types"
import { ROUTES } from "@/constants/routes"

// Get current date for the dashboard
const today = new Date()
const formattedToday = format(today, "EEEE, MMMM d, yyyy")

type EventWithStatus = TodayEvent & {
  status: 'active' | 'upcoming' | 'ended'
}

interface TodaysEventsProps {
  initialEvents: TodayEvent[]
  totalEvents: number
  totalPages: number
  currentPage: number
}

export default function TodaysEvents({
  initialEvents,
  totalEvents,
  totalPages,
  currentPage
}: TodaysEventsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [events, setEvents] = useState<EventWithStatus[]>([])

  useEffect(() => {
    const processedEvents = initialEvents.map(event => {
      const eventDate = new Date(event.date)

      const endDate = new Date(eventDate)
      endDate.setHours(endDate.getHours() + 4)
      
      const now = new Date()
      
      let status: 'active' | 'upcoming' | 'ended'
      
      if (isBefore(now, eventDate)) {
        status = 'upcoming'
      } else if (isAfter(now, endDate)) {
        status = 'ended'
      } else {
        status = 'active'
      }
      
      return {
        ...event,
        status
      }
    })
    
    setEvents(processedEvents)
  }, [initialEvents])

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && event.status === "active"
    if (activeTab === "upcoming") return matchesSearch && event.status === "upcoming"

    return matchesSearch
  })

  const getEventStatus = (event: EventWithStatus) => {
    const eventDate = new Date(event.date)
    const now = new Date()

    if (event.status === 'upcoming') {
      const hoursUntilStart = Math.round((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60))
      return {
        text: `Starts in ${hoursUntilStart} hour${hoursUntilStart !== 1 ? "s" : ""}`,
        color: "bg-blue-500",
        variant: "default",
      }
    } else if (event.status === 'ended') {
      return {
        text: "Ended",
        color: "bg-gray-500",
        variant: "secondary",
      }
    } else {
      return {
        text: "In Progress",
        color: "bg-green-500",
        variant: "success",
      }
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-background px-3 rounded-lg py-3">
        <div>
          <h1 className="text-3xl font-bold">Today's Events</h1>
          <p className="text-muted-foreground">{formattedToday}</p>
        </div>
        
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search events by name or location..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                             <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events list */}
        <div className="grid gap-6">
          {filteredEvents.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No events found</h3>
                <p className="text-muted-foreground text-center mt-1">
                  {searchQuery ? "Try adjusting your search query" : "There are no events scheduled for today"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredEvents.map((event) => {
              const status = getEventStatus(event)
              const scannedPercentage = event.sales.ticketsSold > 0 
                ? Math.round((event.sales.ticketsScanned / event.sales.ticketsSold) * 100) 
                : 0

              return (
                <Card key={event._id} className="overflow-hidden">
                  <div className="md:flex">
                    <div className="relative w-full md:w-64 h-48 md:h-auto">
                      <Image
                        src={event.mediaUrls?.[0] || "/placeholder.svg?height=400&width=800"}
                        alt={event.name}
                        fill
                        className="object-cover"
                      />
                      <Badge className={`absolute top-2 right-2 ${status.color}`} variant="default">
                        {status.text}
                      </Badge>
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-bold">{event.name}</h2>
                          <div dangerouslySetInnerHTML={{ __html: event.description }} className="text-muted-foreground" />

                          <div className="flex flex-col sm:flex-row gap-4 mt-4">
                            <div className="flex items-center gap-2">
                              <Clock className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{format(new Date(event.date), "h:mm a")}</p>
                                <p className="text-sm text-muted-foreground">
                                  {format(new Date(event.date), "EEEE, MMMM d, yyyy")}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{event.location}</p>
                              </div>
                            </div>
                          </div>

                         
                        </div>

                        <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Tickets Sold</p>
                              <p className="font-medium">
                                {event.sales.ticketsSold} / {event.sales.totalTicketSupply}
                              </p>
                            </div>
                            <div className="bg-primary/10 p-2 rounded-full">
                              <Ticket className="h-5 w-5 text-primary" />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Checked In</p>
                              <p className="font-medium">
                                {event.sales.ticketsScanned} / {event.sales.ticketsSold}
                              </p>
                            </div>
                            <div className="bg-primary/10 p-2 rounded-full">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Check-in Progress</span>
                          <span className="text-sm font-medium">
                            {event.sales.ticketsScanned} / {event.sales.ticketsSold}
                          </span>
                        </div>
                        <Progress value={scannedPercentage} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-2">
                          {scannedPercentage}% of attendees checked in
                        </p>
                      </div>

                      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                      
                        <Button asChild>
                          <Link href={ROUTES.DASHBOARD.SCAN.SCAN_EVENT(event._id)}>
                            <QrCode className="mr-2 h-4 w-4" />
                            Scan Tickets
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredEvents.length} of {totalEvents} events
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                asChild
              >
                <Link href={`?page=${currentPage - 1}`}>Previous</Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                asChild
              >
                <Link href={`?page=${currentPage + 1}`}>Next</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}