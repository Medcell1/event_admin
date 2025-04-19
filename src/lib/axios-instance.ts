import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import { signOut } from "next-auth/react";
import { getCurrentUser } from "./get-session";

export const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const isDev = process.env.NODE_ENV === "development"; 

const log = (...args: any[]) => {
  if (isDev) console.log(...args);
};

const logRequest = (config: InternalAxiosRequestConfig) => {
  let loggedData = config.data;

  if (config.data instanceof FormData) {
    loggedData = {};
    config.data.forEach((value, key) => {
      loggedData[key] = value;
    });
  }

  log("🔵 Request:", {
    URL: `${config.baseURL}${config.url}`,
    Method: config.method,
    Headers: config.headers,
    Params: config.params,
    Data: loggedData,
  });
};
const logResponse = (response: AxiosResponse) => {
  log("🟢 Response:", {
    URL: `${response.config.baseURL}${response.config.url}`,
    Status: response.status,
    Headers: response.headers,
    Data: response.data,
  });
};

const logError = (error: AxiosError) => {
  if (error.response) {
    log("🔴 Response Error:", {
      URL: `${error.response.config.baseURL}${error.response.config.url}`,
      Status: error.response.status,
      Headers: error.response.headers,
      Data: error.response.data,
    });

    if (error.response.status === 401) {
      alert("Session expired. Please log in again.");
      signOut();
    }
  } else if (error.request) {
    log("⚠️ No response received:", error.request);
  } else {
    log("🚨 Request setup error:", error.message);
  }
};

const createAxiosInstance = (): AxiosInstance => {
  
  const axiosInstance = axios.create({
    baseURL: API_URL,
  });

  // Request Interceptor
  axiosInstance.interceptors.request.use(
    async (config) => {
      const session: any = await getCurrentUser();

      if (!config.url?.endsWith("/login") && !config.url?.endsWith("/signup")) {
        const token = session?.user?.token;
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        } else {
          log("⚠️ No token found for authentication.");
        }
      }

      logRequest(config);
      return config;
    },
    (error: AxiosError) => {
      log("❌ Request Error:", error);
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      logResponse(response);
      return response;
    },
    (error: AxiosError) => {
      logError(error);
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default createAxiosInstance;
