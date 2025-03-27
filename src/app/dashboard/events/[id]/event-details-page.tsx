"use client"

import { useState } from "react"
import { format } from "date-fns"
import Image from "next/image"
import {
  ArrowUpRight,
  BookmarkIcon,
  Calendar,
  Clock,
  Edit,
  Eye,
  MapPin,
  Share2,
  Tag,
  Ticket,
  User,
  Users,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventDetails } from "@/@types"

interface TicketTypeWithSalesInfo {
  _id: string;
  price: number;
  name: string;
  description: string;
  quantity: number;
  visibility: string;
  codePrefix: string;
  createdBy: string;
  soldOut: boolean;
  sold: number;
}

interface Props {
  eventDetails: EventDetails | null;
}

export default function EventDetailsPage({ eventDetails }: Props) {
  const [activeTab, setActiveTab] = useState("overview")

  const ticketSalesPercentage = Math.round((eventDetails!.sales?.ticketsSold / eventDetails!.sales?.totalTicketSupply) * 100) || 0

  const eventDate = new Date(eventDetails!.date)
  const formattedEventDate = format(eventDate, "MMMM d, yyyy")
  const formattedEventTime = format(eventDate, "h:mm a")
  const lastUpdated = new Date(eventDetails!.lastUpdated)
  const formattedLastUpdated = format(lastUpdated, "MMM d, yyyy 'at' h:mm a")

  const ticketTypesWithSales: TicketTypeWithSalesInfo[] = eventDetails!.ticketTypes.map(ticket => {
    const salesKey = Object.keys(eventDetails!.sales.ticketTypeSales).find(
      key => key.includes(ticket._id)
    );
    
    const salesData = salesKey ? eventDetails!.sales.ticketTypeSales[salesKey] : {
      sold: 0,
      scanned: 0,
      totalSupply: ticket.totalSupply
    };

    return {
      ...ticket,
      quantity: ticket.totalSupply,
      sold: salesData.sold || 0
    };
  });

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex rounded-md px-4 py-4 flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-background">
        <div>
          <h1 className="text-2xl font-bold">{eventDetails!.name}</h1>
          <p className="text-muted-foreground">Last updated: {formattedLastUpdated}</p>
        </div>
        <div className="flex gap-2">
       
          <Button>
            <ArrowUpRight className="mr-2 h-4 w-4" /> View Public Page
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tickets">Tickets</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <Card>
                <CardContent className="p-0">
                  <div className="relative w-full h-64">
                    <Image
                      src={eventDetails!.mediaUrls?.[0] || "/placeholder.svg?height=400&width=800"}
                      alt={eventDetails!.name}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold">{eventDetails!.name}</h2>
                
                        <p className="text-muted-foreground" dangerouslySetInnerHTML={{__html: eventDetails!.description}}/>
                      </div>
                      <Badge variant="outline" className="w-fit">
                        {eventDetails!.visibility?.charAt(0).toUpperCase() + eventDetails!.visibility?.slice(1) || "Public"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{formattedEventDate}</p>
                          <p className="text-sm text-muted-foreground">{formattedEventTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{eventDetails!.location}</p>
                          <p className="text-sm text-muted-foreground">Venue Location</p>
                        </div>
                      </div>
                    </div>

                    {eventDetails!.categories && eventDetails!.categories.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-2">Categories</h3>
                        <div className="flex flex-wrap gap-2">
                          {eventDetails!.categories.map((category) => (
                            <Badge key={category._id} variant="secondary">
                              {category.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Organizer info */}
              {eventDetails!.createdBy && (
                <Card>
                  <CardHeader>
                    <CardTitle>Organizer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={eventDetails!.createdBy.avatarUrl} alt={eventDetails!.createdBy.name} />
                        <AvatarFallback>{eventDetails!.createdBy.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{eventDetails!.createdBy.name}</p>
                        <p className="text-sm text-muted-foreground">@{eventDetails!.createdBy.username}</p>
                        <p className="text-sm mt-1">{eventDetails!.createdBy.bio}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="tickets" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ticket Sales</CardTitle>
                  <CardDescription>Track your ticket sales and attendance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Tickets Sold</span>
                        <span className="text-sm font-medium">
                          {eventDetails!.sales?.ticketsSold || 0} / {eventDetails!.sales?.totalTicketSupply || 0}
                        </span>
                      </div>
                      <Progress value={ticketSalesPercentage} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2">{ticketSalesPercentage}% of tickets sold</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center">
                            <Ticket className="h-8 w-8 text-primary mb-2" />
                            <p className="text-2xl font-bold">{eventDetails!.sales?.ticketsSold || 0}</p>
                            <p className="text-sm text-muted-foreground">Tickets Sold</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center">
                            <Users className="h-8 w-8 text-primary mb-2" />
                            <p className="text-2xl font-bold">{eventDetails!.sales?.ticketsScanned || 0}</p>
                            <p className="text-sm text-muted-foreground">Checked In</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center">
                            <Tag className="h-8 w-8 text-primary mb-2" />
                            <p className="text-2xl font-bold">
                              {(eventDetails!.sales?.totalTicketSupply || 0) - (eventDetails!.sales?.ticketsSold || 0)}
                            </p>
                            <p className="text-sm text-muted-foreground">Available</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
           
              </Card>
              
              {ticketTypesWithSales.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Ticket Types</CardTitle>
                    <CardDescription>Manage your different ticket offerings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {ticketTypesWithSales.map((ticket) => (
                        <div key={ticket._id} className="border rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{ticket.name}</h3>
                                {!ticket.soldOut ? (
                                  <Badge variant="default" className="bg-green-500">
                                    On Sale
                                  </Badge>
                                ) : (
                                  <Badge variant="destructive">Sold Out</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{ticket.description}</p>
                            </div>
                            <div className="text-lg font-bold">${ticket.price.toFixed(2)}</div>
                          </div>

                          <div className="mt-4">
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium">Sold</span>
                              <span className="text-sm font-medium">
                                {ticket.sold} / {ticket.quantity}
                              </span>
                            </div>
                            <Progress 
                              value={(ticket.sold / ticket.quantity) * 100} 
                              className="h-2" 
                            />
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2 mt-4">
                            <div className="text-sm">
                              <span className="font-medium">{ticket.quantity - ticket.sold}</span> remaining
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
              
                </Card>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Analytics</CardTitle>
                  <CardDescription>Track engagement and performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                      <Eye className="h-8 w-8 text-primary mb-2" />
                      <p className="text-2xl font-bold">{eventDetails!.views || 0}</p>
                      <p className="text-sm text-muted-foreground">Views</p>
                    </div>
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                      <Share2 className="h-8 w-8 text-primary mb-2" />
                      <p className="text-2xl font-bold">{eventDetails!.shares || 0}</p>
                      <p className="text-sm text-muted-foreground">Shares</p>
                    </div>
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                      <BookmarkIcon className="h-8 w-8 text-primary mb-2" />
                      <p className="text-2xl font-bold">{eventDetails!.bookmarks || 0}</p>
                      <p className="text-sm text-muted-foreground">Bookmarks</p>
                    </div>
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                      <User className="h-8 w-8 text-primary mb-2" />
                      <p className="text-2xl font-bold">{eventDetails!.sales?.ticketsSold || 0}</p>
                      <p className="text-sm text-muted-foreground">Attendees</p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Engagement Over Time</h3>
                    <div className="h-64 flex items-center justify-center border rounded-lg">
                      <p className="text-muted-foreground">Analytics chart would appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right column - Stats and quick actions */}
        <div className="space-y-6">
          {/* Event stats */}
          <Card>
            <CardHeader>
              <CardTitle>Event Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span>Views</span>
                </div>
                <span className="font-medium">{eventDetails!.views || 0}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-muted-foreground" />
                  <span>Tickets Sold</span>
                </div>
                <span className="font-medium">{eventDetails!.sales?.ticketsSold || 0}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <BookmarkIcon className="h-4 w-4 text-muted-foreground" />
                  <span>Bookmarks</span>
                </div>
                <span className="font-medium">{eventDetails!.bookmarks || 0}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                  <span>Shares</span>
                </div>
                <span className="font-medium">{eventDetails!.shares || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Event timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Event Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div className="w-px h-full bg-border mt-1"></div>
                  </div>
                  <div>
                    <p className="font-medium">Event Created</p>
                    <p className="text-sm text-muted-foreground">
                      {eventDetails!.createdAt ? format(new Date(eventDetails!.createdAt), "MMM d, yyyy") : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="w-px h-full bg-border mt-1"></div>
                  </div>
                  <div>
                    <p className="font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {eventDetails!.lastUpdated ? format(new Date(eventDetails!.lastUpdated), "MMM d, yyyy") : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <Calendar className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Event Date</p>
                    <p className="text-sm text-muted-foreground">{formattedEventDate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

       
        </div>
      </div>
    </div>
  )
}