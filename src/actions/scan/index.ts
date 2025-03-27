import { ScanResponse } from "@/@types";
import createAxiosInstance from "@/lib/axios-instance";

const api = createAxiosInstance();

type ScanParams = {
  keyWord?: string | null;
  ticketNumber?: string | null;
  eventId: string;
};

const ScanTicketService = {
  /**
   * Scan Ticket By QR
   * @returns SCANRESPONSE
   */
  scanTicket: async (params: ScanParams): Promise<ScanResponse> => {
    try {
      if (!params.keyWord && !params.ticketNumber) {
        throw new Error(
          "At least one of 'keyWord' or 'ticketNumber' must be provided."
        );
      }
  
      if (params.keyWord && params.ticketNumber) {
        throw new Error(
          "Only one of 'keyWord' or 'ticketNumber' should be provided."
        );
      }
      console.log('okayyyyyyyyyyy')

      const response = await api.post("/tickets/scan", params);
      
      // Return the response data with success flag based on status code
      return {
        success: response.status === 200,
        ...response.data,
      } as ScanResponse;
    } catch (error: any) {
      // Extract error message from response if available
      const errorMessage = error.response?.data?.message || error.message || "Failed to check ticket status.";
      
      return {
          success: false,
          message: errorMessage,
          ticket: null,
      } as unknown as ScanResponse;
    }
  }
};

export default ScanTicketService;
