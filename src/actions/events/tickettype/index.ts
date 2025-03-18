import { TicketType, TicketTypeRequest } from "@/@types";
import createAxiosInstance from "@/lib/axios-instance";
import { Validator, required } from "@/utils/validation";

const api = createAxiosInstance();

/**
 * Service module for ticket type operations
 */
const TicketTypesService = {
  /**
   * Create a new ticket type
   * @param data Ticket type creation data
   * @returns Response data from API
   */
  create: async (data: TicketTypeRequest) => {
    try {
      const validator = new Validator(data, {
        name: required("Name"),
        description: required("Description"),
        codePrefix: required("Code Prefix"),
        price: required("Price"),
        totalSupply: required("Total Supply"),
        visibility: required("Visibility"),
      });

      if (validator.hasErrors()) {
        throw new Error(validator.getFirstError()!);
      }

      const response = await api.post("/ticketTypes/action", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      return response.data;
    } catch (error) {
      console.error("Error creating ticket type:", error);
      throw error;
    }
  },

  /**
   * Get all available ticket types
   * @returns Array of ticket types
   */
  getAll: async (): Promise<TicketType[]> => {
    try {
      const response = await api.get("/ticketTypes");
      return response.data.ticketTypes || [];
    } catch (error) {
      console.error("Error fetching ticket types:", error);
      throw error;
    }
  },

  /**
   * Get a ticket type by ID
   * @param id The ticket type ID
   * @returns Ticket type data
   */
  getById: async (id: string): Promise<TicketType> => {
    try {
      const response = await api.get(`/ticketTypes/${id}`);
      return response.data.ticketType;
    } catch (error) {
      console.error(`Error fetching ticket type with ID ${id}:`, error);
      throw error;
    }
  },
    /**
   * Get a ticket type for a User By ID
   * @param id The User ID
   * @returns Ticket type data
   */
    getForUser: async (id: string): Promise<TicketType[]> => {
      try {
        const response = await api.get(`/ticketTypes/user/${id}`);
        return response.data as TicketType[];
      } catch (error) {
        console.error(`Error fetching ticket type with ID ${id}:`, error);
        throw error;
      }
    },

  /**
   * Update an existing ticket type
   * @param id Ticket type ID
   * @param data Updated ticket type data
   * @returns Response data from API
   */
  update: async (id: string, data: Partial<TicketTypeRequest>): Promise<any> => {
    try {
      const response = await api.put(`/ticketTypes/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error updating ticket type with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a ticket type
   * @param id Ticket type ID to delete
   * @returns Response data from API
   */
  delete: async (id: string): Promise<any> => {
    try {
      const response = await api.delete(`/ticketTypes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting ticket type with ID ${id}:`, error);
      throw error;
    }
  }
};

export default TicketTypesService;