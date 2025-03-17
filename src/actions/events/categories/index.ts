import { EventCategory,  } from "@/@types";
import createAxiosInstance from "@/lib/axios-instance";

const api = createAxiosInstance();


const EventCategoriesService = {


  /**
   * Get all available Categories
   * @returns Array of Categories
   */
  getAll: async (): Promise<EventCategory[]> => {
    try {
      const response = await api.get("/events/categories");
      return response.data || [];
    } catch (error) {
      console.error("Error fetching ticket types:", error);
      throw error;
    }
  },

  
};

export default EventCategoriesService;