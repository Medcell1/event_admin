import { Suspense } from "react";
import { EventDetails } from "@/@types";
import EventService from "@/actions/events";
import EventDetailsSkeleton from "./event-details-loading";
import EventDetailsPage from "./event-details-page";

// Define the params type
interface PageProps {
  params: {
    id: string;
  }
}

async function fetchEventDetails(id: string): Promise<EventDetails> {
  try {
    return await EventService.getById(id);
  } catch (error) {
    console.error("Failed to fetch event details:", error);
    throw new Error("Failed to load event details");
  }
}

export default async function EventParametersPage({ params }: PageProps) {
  // Use React's error boundary instead of manual try/catch
  // The error component will be rendered automatically when there's an error
  return (
    <Suspense fallback={<EventDetailsSkeleton />}>
      <EventDetailsContent id={params.id} />
    </Suspense>
  );
}

// Create a separate component to handle async data fetching
async function EventDetailsContent({ id }: { id: string }) {
  const eventDetails = await fetchEventDetails(id);
  return <EventDetailsPage eventDetails={eventDetails} />;
}