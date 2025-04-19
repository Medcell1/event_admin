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
  
      const response = await api.post("/tickets/scan", params);
      
      // Return the response data with success flag based on status code
      return {
        success: response.status === 200,
        ...response.data,
      } as ScanResponse;
    } catch (error: any) {
      // Extract error message from response if available
      const errorMessage = error.response?.data?.message || error.message || "Failed to check ticket status.";
      const statusCode = error.response?.status || 500;
      
      return {
        success: false,
        message: errorMessage,
        ticket: error.response?.data?.ticket || null,
        statusCode: statusCode,
        // Add a specific flag for already scanned tickets
        alreadyScanned: statusCode === 400 && error.response?.data?.ticket != null,
        // Add a flag for not found/invalid tickets
        notFound: statusCode === 404,
      } as unknown as ScanResponse;
    }
  }
};

export default ScanTicketService;
