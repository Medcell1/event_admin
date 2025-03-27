import { Event } from "@/@types";
import { fonts } from "../fonts";
import { EventCard } from "./events-card";


interface EventsProps {
  events: Event[];
  currentPage: number;
  totalPages: number;
  totalEvents: number;
}

export default function Events({ events, currentPage, totalPages, totalEvents }: EventsProps) {
  if (!events || events.length === 0) {
    return <div>NOT FOUND</div>;
  }

  const startItem = (currentPage - 1) * (events.length) + 1;
  const endItem = Math.min(startItem + events.length - 1, totalEvents);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-4">
        <p className={`text-sm text-muted-foreground ${fonts.openSans}`}>
          Showing {startItem}-{endItem} of {totalEvents} events
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard
          key={event._id}
          id={event._id}
          title={event.name || "Untitled Event"}
          image={event.mediaUrls?.[0] || "/images/auth.png"}
          ticketsSold={event.sales?.ticketsSold || 0}
          totalTickets={event.sales?.totalTicketSupply || 0}
          pendingTickets={(event.sales?.totalTicketSupply || 0) - (event.sales?.ticketsSold || 0)}
          scannedTickets={event.sales?.ticketsScanned || 0}
          description={event.description}
          location={event.location}
          visibility={event.visibility}
          date={event.date}
        />        ))}
      </div>
    </div>
  );
}