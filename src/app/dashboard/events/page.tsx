// src/app/events/page.tsx
import EventsContainer from "@/components/events/events-server"
import EventsPage from "./event-page"

export default async function Page({ searchParams }: { searchParams: Promise<{ search?: string, category?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.search || "";
  const category = resolvedSearchParams?.category || '';

  return (
    <EventsPage>
      <EventsContainer searchParams={{ category: category, search: search }} />
    </EventsPage>
  )
}
