import { Contributor, CollaboratorResponse } from "@/@types";
import createAxiosInstance from "@/lib/axios-instance";

const api = createAxiosInstance();

type CreateCollaboratorParams = {
  name: string;
};

type ChangePasswordParams = {
  name: string;
  password?: string;
};

const CollaboratorService = {
  /**
   * Create a new contributor account (admin only)
   * @returns CollaboratorResponse
   */
  createCollaborator: async (
    params: CreateCollaboratorParams
  ): Promise<CollaboratorResponse> => {
    try {
      if (!params.name || params.name.length < 3) {
        throw new Error("Name must contain at least 3 characters");
      }

      const response = await api.post("/admin/contributor/action", params);

      return {
        success: response.status === 200,
        message: response.data.message,
        user: response.data.user,
        credentials: response.data.credentials,
      } as CollaboratorResponse;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create contributor account.";
      const statusCode = error.response?.status || 500;

      return {
          success: false,
          message: errorMessage,
          statusCode: statusCode,
          user: null,
          credentials: null,
      } as unknown as CollaboratorResponse;
    }
  },

  /**
   * Change contributor password (admin only)
   * @returns CollaboratorResponse
   */
  changePassword: async (
    params: ChangePasswordParams
  ): Promise<CollaboratorResponse> => {
    try {
      if (!params.name) {
        throw new Error("Contributor name must be provided");
      }

      const response = await api.post(
        "/admin/contributor/change_password",
        params
      );

      return {
        success: response.status === 200,
        message: response.data.message,
        credentials: response.data.credentials,
      } as CollaboratorResponse;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to change contributor password.";
      const statusCode = error.response?.status || 500;

      return {
          success: false,
          message: errorMessage,
          statusCode: statusCode,
          credentials: null,
      } as unknown as CollaboratorResponse;
    }
  },

  /**
   * Get all contributors (admin only)
   * @returns CollaboratorResponse with contributors list
   */
  getContributors: async (): Promise<CollaboratorResponse> => {
    try {
      const response = await api.get("/admin/contributor/action");

      return {
        success: response.status === 200,
        message: response.data.message,
        contributors: response.data.contributors,
      } as CollaboratorResponse;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch contributors.";
      const statusCode = error.response?.status || 500;

      return {
        success: false,
        message: errorMessage,
        statusCode: statusCode,
        contributors: [],
      } as CollaboratorResponse;
    }
  },
};

export default CollaboratorService;