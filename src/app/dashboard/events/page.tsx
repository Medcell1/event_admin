import EventsContainer from "@/components/events/events-server"
import EventsPage from "./event-page"

export default async function Page({ searchParams }: { searchParams: Promise<{ search?: string, category?: string, page?: string, limit?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.search || "";
  const category = resolvedSearchParams?.category || '';
  const page = resolvedSearchParams?.page || "1";
  const limit = resolvedSearchParams?.limit || "10";


  return (
    <EventsPage>
      <EventsContainer searchParams={{ category: category, search: search,limit: limit, page: page }} />
    </EventsPage>
  )
}
