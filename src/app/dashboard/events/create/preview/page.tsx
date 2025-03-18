"use client"

import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Calendar, Clock, MapPin, Tag, Ticket, ArrowLeft, Send, X } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEventForm } from "@/hooks/use-event-form"
import { ROUTES } from "@/constants/routes"
import { EventRequest, TicketTypeRequest } from "@/@types"
import TicketTypesService from "@/actions/events/tickettype"
import EventService from "@/actions/events"
import { getCurrentUser } from "@/lib/get-session"
import { toast } from "sonner"

export default function PreviewPage() {
  const router = useRouter()
  const { formData, resetForm } = useEventForm()
  const [showFullImage, setShowFullImage] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false) 

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const session = await getCurrentUser();
      console.log("Publishing event:", formData);
  
      // Combine date and time into a single Date object
      const combinedDateTime = new Date(formData.date!);
      const [hours, minutes] = formData.time.split(":").map(Number);
      combinedDateTime.setHours(hours, minutes, 0, 0);
  
      // Create tickets and collect their IDs
      const tickets: string[] = [];
      for (const ticket of formData.tickets) {
        const ticketReq = {
          name: ticket.name,
          price: ticket.price,
          codePrefix: ticket.codePrefix,
          description: ticket.description,
          visibility: ticket.visibility,
          totalSupply: ticket.totalSupply,
        } as TicketTypeRequest;
  
        // Create the ticket and store its ID
        const ticketCreated = await TicketTypesService.create(ticketReq);
        tickets.push(ticketCreated._id);
      }
  
      // Now that we have all ticket IDs, create the event
      const eventReq = {
        name: formData.name,
        categories: formData.category.map((category) => category._id),
        date: combinedDateTime.toISOString(),
        description: formData.description,
        files: [formData.bannerImage!],
        location: formData.location,
        owner: session?.user?.id,
        ticketTypes: tickets, // Use the populated ticket IDs
      } as unknown as EventRequest;
  
      // Create the event
      await EventService.create(eventReq);
  
      // Show success toast
      toast.success("Event Published Successfully", {
        description: "Your Event has been successfully published",
      });
  
      // Redirect to the events page and reset the form
      router.replace(ROUTES.DASHBOARD.EVENTS.ROOT);
      resetForm();
    } catch (error) {
      console.error("Error publishing event:", error);
      toast.error("Failed to Publish Event", {
        description: "Please try again.",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-left">
        <h1 className="text-3xl font-bold text-gray-900">Preview Your Event</h1>
        <p className="mt-2 text-lg text-gray-500">Review all the details before publishing</p>
      </div>

      <div className="space-y-8">
        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="pb-0 relative">
            {formData.bannerImage && (
              <div
                className="aspect-video w-full max-h-[300px] overflow-hidden rounded-t-xl bg-muted cursor-pointer"
                onClick={() => setShowFullImage(true)}
              >
                <img
                  src={URL.createObjectURL(formData.bannerImage) || "/placeholder.svg"}
                  alt="Event banner"
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-6">
            <CardTitle className="text-2xl font-bold mb-2">{formData.name}</CardTitle>
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.category &&
                formData.category.map((category, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    <Tag className="h-3 w-3 mr-1" />
                    {category.name}
                  </Badge>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm">
                  {formData.date ? format(formData.date, "EEEE, MMMM d, yyyy") : "Date not set"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm">{formData.time || "Time not set"}</span>
              </div>
              <div className="flex items-center gap-2 md:col-span-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm">{formData.location}</span>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">About this event</h3>
              <div
                className="text-gray-600 text-sm whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: formData.description }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Ticket className="h-5 w-5 text-primary" />
              Available Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {formData.tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <div className="font-medium">{ticket.name}</div>
                    <div className="text-xs text-gray-500">{ticket.totalSupply} tickets available</div>
                    {ticket.description && <div className="mt-1 text-xs text-gray-600">{ticket.description}</div>}
                  </div>
                  <Badge variant="secondary" className="text-sm px-2 py-1">
                    ${ticket.price.toFixed(2)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            onClick={() => router.push(ROUTES.DASHBOARD.EVENTS.CREATE.TICKETS)}
            className="flex items-center text-sm"
          >
            <ArrowLeft className="mr-1 h-3 w-3" /> Previous
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex items-center bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
          >
            {isPublishing ? "Publishing..." : "Publish Event"} <Send className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>

      {showFullImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-auto">
            <img
              src={URL.createObjectURL(formData.bannerImage!) || "/placeholder.svg"}
              alt="Full size event banner"
              className="w-full h-auto"
            />
            <button
              className="absolute top-2 right-2 bg-white rounded-full p-1"
              onClick={() => setShowFullImage(false)}
            >
              <X className="h-6 w-6 text-gray-800" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}