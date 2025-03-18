import {  EventRequest } from "@/@types";
import createAxiosInstance from "@/lib/axios-instance";
import { getCurrentUser } from "@/lib/get-session";
import { Validator, required } from "@/utils/validation";

const api = createAxiosInstance();

/**
 * Service module for event operations
 */
const EventService = {
  /**
   * Create a new event
   * @param data Event creation data
   * @returns Response data from API
   */
  create: async (data: EventRequest) => {
    try {
      const validator = new Validator(data, {
        name: required("Name"),
        description: required("Description"),
        date: required("Date"),
        location: required("Location"),
        owner: required("Organizer"),
        categories: required("Categories"),
        files: required("Image"),
        ticketTypes: required("Ticket Types"),
      });
  
      if (validator.hasErrors()) {
        throw new Error(validator.getFirstError()!);
      }
  
      const formData = new FormData();
  
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("date", data.date);
      formData.append("location", data.location);
      formData.append("owner", data.owner);
  
      if (Array.isArray(data.categories)) {
        formData.append("categories", JSON.stringify(data.categories));
      }
  
      if (Array.isArray(data.files)) {
        data.files.forEach((file) => {
          formData.append("files", file);
        });
      }
  
      if (Array.isArray(data.ticketTypes)) {
        formData.append("ticketTypes", JSON.stringify(data.ticketTypes));
      }
  
      const response = await api.post("/events/action", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  },

  /**
   * Get all available events
   * @returns Array of events
   */
//   getAll: async (): Promise<Event[]> => {
//     try {
//       const response = await api.get("/events");
//       return response.data.events || [];
//     } catch (error) {
//       console.error("Error fetching events:", error);
//       throw error;
//     }
//   },

  /**
   * Get all available events for User
   * @returns Array of events
   */
  getUserEvents: async ({
    categories,
    searchTerm,
  }: {
    categories?: string[];
    searchTerm?: string;
  }): Promise<Event[]> => {
    try {
      const session = await getCurrentUser();
      const params: Record<string, any> = {};
  
      if (categories && categories.length > 0) {
        params.categories = categories.join(","); 
       }
  
      if (searchTerm) {
        params.searchTerm = searchTerm;
      }
  
      const response = await api.get(`/events/user/${session?.user?.id}`, {
        params,
      });
  
      return response.data || [];
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  },
  /**
   * Get an event by ID
   * @param id The event ID
   * @returns Event data
   */
  getById: async (id: string): Promise<Event> => {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data.event;
    } catch (error) {
      console.error(`Error fetching event with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update an existing event
   * @param id Event ID
   * @param data Updated event data
   * @returns Response data from API
   */
  update: async (id: string, data: Partial<EventRequest>): Promise<any> => {
    try {
      const response = await api.put(`/events/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error updating event with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete an event
   * @param id Event ID to delete
   * @returns Response data from API
   */
  delete: async (id: string): Promise<any> => {
    try {
      const response = await api.delete(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting event with ID ${id}:`, error);
      throw error;
    }
  }
};

export default EventService;