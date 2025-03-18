'use server';

import { Suspense } from 'react';
import { Event } from '@/@types';
import EventService from '@/actions/events';
import { EventCardSkeleton } from './EventCardSkeleton';
import Events from './display-events';

interface SearchParams {
  search?: string;
  category?: string;
}

export default async function EventsContainer({ searchParams }: { searchParams: SearchParams }) {
  // Safely extract search parameters
  const searchTerm = typeof searchParams?.search === 'string' ? searchParams.search : undefined;
  const category = typeof searchParams?.category === 'string' ? searchParams.category : undefined;
  const categories = category ? [category] : undefined;
  
  try {
    // Fetch events directly in the container component
    const events = await EventService.getUserEvents({
      categories,
      searchTerm,
    }) as unknown as Event[];
    console.log(`=======>events====.${events}`)

    return (
        <Suspense fallback={<EventsSkeletonGrid />}>
        <Events events={events} />
      </Suspense>

    );
      
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return (
      <div className="w-full text-center py-8">
        <p className="text-muted-foreground">Failed to load events. Please try again later.</p>
      </div>
    );
  }
}

function EventsSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <EventCardSkeleton key={index} />
      ))}
    </div>
  );
}