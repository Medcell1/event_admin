import { Event } from "@/@types";
import { EventCard } from "./events-card";

export default function Events({events}: {events: Event[]}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {events.map((event, index) => {
        try {
          return (
            <EventCard
              key={event._id || index}
              title={event.name || 'Untitled Event'}
              image={event.mediaUrls?.[0] || "/images/auth.png"}
              ticketsSold={event.sales?.ticketsSold || 0}
              totalTickets={event.sales?.totalTicketSupply || 0}
              pendingTickets={
                (event.sales?.totalTicketSupply || 0) - (event.sales?.ticketsSold || 0)
              }
              scannedTickets={event.sales?.ticketsScanned || 0}
            />
          );
        } catch (error) {
          console.error(`Error rendering event at index ${index}:`, error, event);
          return null;
        }
      })}
    </div>
  );
}