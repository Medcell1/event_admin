import { Suspense } from "react";

import { EventCategory } from "@/@types";
import EventCategoriesService from "@/actions/events/categories";
import EventParametersClientPage from "@/components/events/create/event-parameter-client";
import Loading from "./loading";

async function fetchCategories(): Promise<EventCategory[]> {
  try {
    return await EventCategoriesService.getAll();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export default async function EventParametersPage() {
  const categories = await fetchCategories();
  


  return (
    <Suspense fallback={<Loading/>}>
      <EventParametersClientPage categories={categories} />
    </Suspense>
  );
}