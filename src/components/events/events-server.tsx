'use server';

import { Suspense } from 'react';
import { Event } from '@/@types';
import EventService from '@/actions/events';
import { EventCardSkeleton } from './EventCardSkeleton';
import Events from './display-events';

interface SearchParams {
  search?: string;
  category?: string;
  page?: string;
  limit?: string;
}

export default async function EventsContainer({ searchParams }: { searchParams: SearchParams }) {
  const searchTerm = typeof searchParams?.search === 'string' ? searchParams.search : undefined;
  const category = typeof searchParams?.category === 'string' ? searchParams.category : undefined;
  const page = typeof searchParams?.page === 'string' ? parseInt(searchParams.page) : 1;
  const limit = typeof searchParams?.limit === 'string' ? parseInt(searchParams.limit) : 10;
  
  const categories = category ? category.split(',') : undefined;
  
  try {
    const result = await EventService.getUserEvents({
      categories,
      searchTerm,
      page,
      limit
    });
    
    const { events, totalEvents, totalPages } = result;
    
    return (
      <Suspense fallback={<EventsSkeletonGrid count={limit} />}>
        <Events 
          events={events} 
          currentPage={page}
          totalPages={totalPages}
          totalEvents={totalEvents}
        />
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

function EventsSkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...Array(count)].map((_, index) => (
        <EventCardSkeleton key={index} />
      ))}
    </div>
  );
}