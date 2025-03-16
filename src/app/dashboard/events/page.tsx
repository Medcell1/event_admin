"use client"
import { EventCard } from "@/components/events/events-card"
import { fonts } from "@/components/fonts"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"
import { useRouter } from "next/navigation"

export default function EventsPage() {
  // Mock data for events
  const events = [
    {
      title: "Sunday Chill",
      image:
        "",
      ticketsSold: 60,
      totalTickets: 100,
      venueRevenue: 1200,
      rechargeRevenue: 1000,
      scannedTickets: 112,
      pendingTickets: 112,
    },
    {
      title: "Tech Conference 2024",
      image: "",
      ticketsSold: 250,
      totalTickets: 500,
      venueRevenue: 5000,
      rechargeRevenue: 2500,
      scannedTickets: 200,
      pendingTickets: 50,
    },
    {
      title: "Summer Music Festival",
      image: "",
      ticketsSold: 1500,
      totalTickets: 2000,
      venueRevenue: 30000,
      rechargeRevenue: 15000,
      scannedTickets: 1200,
      pendingTickets: 300,
    },
    {
      title: "Summer Music Festival",
      image: "",
      ticketsSold: 1500,
      totalTickets: 2000,
      venueRevenue: 30000,
      rechargeRevenue: 15000,
      scannedTickets: 1200,
      pendingTickets: 300,
    },
    {
      title: "Summer Music Festival",
      image: "",
      ticketsSold: 1500,
      totalTickets: 2000,
      venueRevenue: 30000,
      rechargeRevenue: 15000,
      scannedTickets: 1200,
      pendingTickets: 300,
    },
    {
      title: "Summer Music Festival",
      image: "",
      ticketsSold: 1500,
      totalTickets: 2000,
      venueRevenue: 30000,
      rechargeRevenue: 15000,
      scannedTickets: 1200,
      pendingTickets: 300,
    },
    {
      title: "Summer Music Festival",
      image: "",
      ticketsSold: 1500,
      totalTickets: 2000,
      venueRevenue: 30000,
      rechargeRevenue: 15000,
      scannedTickets: 1200,
      pendingTickets: 300,
    },
    {
      title: "Summer Music Festival",
      image: "",
      ticketsSold: 1500,
      totalTickets: 2000,
      venueRevenue: 30000,
      rechargeRevenue: 15000,
      scannedTickets: 1200,
      pendingTickets: 300,
    },
    {
      title: "Summer Music Festival",
      image: "",
      ticketsSold: 1500,
      totalTickets: 2000,
      venueRevenue: 30000,
      rechargeRevenue: 15000,
      scannedTickets: 1200,
      pendingTickets: 300,
    },
    {
      title: "Summer Music Festival",
      image: "",
      ticketsSold: 1500,
      totalTickets: 2000,
      venueRevenue: 30000,
      rechargeRevenue: 15000,
      scannedTickets: 1200,
      pendingTickets: 300,
    },
    {
      title: "Summer Music Festival",
      image: "",
      ticketsSold: 1500,
      totalTickets: 2000,
      venueRevenue: 30000,
      rechargeRevenue: 15000,
      scannedTickets: 1200,
      pendingTickets: 300,
    },
    {
      title: "Summer Music Festival",
      image: "",
      ticketsSold: 1500,
      totalTickets: 2000,
      venueRevenue: 30000,
      rechargeRevenue: 15000,
      scannedTickets: 1200,
      pendingTickets: 300,
    },
    // Add more events as needed
  ]
const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="px-10 py-6 bg-white w-full rounded-lg flex flex-row justify-between items-center">
        <h1 className={`${fonts.poppins} text-xl`}>All Events</h1>
        <Button onClick={()=> router.push(ROUTES.DASHBOARD.EVENTS.CREATE.PARAMETERS)} className={fonts.openSans}>Create Event</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <EventCard
            key={index}
            title={event.title}
            image={event.image}
            ticketsSold={event.ticketsSold}
            totalTickets={event.totalTickets}
            venueRevenue={event.venueRevenue}
            rechargeRevenue={event.rechargeRevenue}
            scannedTickets={event.scannedTickets}
            pendingTickets={event.pendingTickets}
          />
        ))}
      </div>
    </div>
  )
}