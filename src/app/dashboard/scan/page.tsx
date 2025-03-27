import EventService from "@/actions/events";
import TodaysEvents from "./today-events";
import { TodaysEventsSkeleton } from "./today-events-loading";
import { Suspense } from "react";

async function TodaysEventsPage({
    searchParams,
  }: {
    searchParams: { categories?: string; searchTerm?: string; page?: string; limit?: string }
  }) {
    const categories = searchParams.categories ? searchParams.categories.split(',') : undefined
    const searchTerm = searchParams.searchTerm
    const page = searchParams.page ? parseInt(searchParams.page) : 1
    const limit = searchParams.limit ? parseInt(searchParams.limit) : 10
  
    
    const { events, totalEvents, totalPages } = await EventService.getUserEventsForToday({
      categories,
      searchTerm,
      page,
      limit,
    })
  
    return (
      <TodaysEvents 
        initialEvents={events} 
        totalEvents={totalEvents} 
        totalPages={totalPages} 
        currentPage={page}
      />
    )
  }
  
  export default function Page({ searchParams }: { searchParams: Record<string, string> }) {
    return (
      <Suspense fallback={<TodaysEventsSkeleton />}>
        <TodaysEventsPage searchParams={searchParams} />
      </Suspense>
    )
  }