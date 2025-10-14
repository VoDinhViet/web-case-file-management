// API utility functions for making HTTP requests

import { unauthorized } from "next/navigation";

interface ValidationDetail {
  property: string;
  code: string;
  message: string;
}

interface ApiError {
  message: string;
  status: number;
  details?: ValidationDetail[];
  error?: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_URL || "";
  }

  // Set base URL dynamically
  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Get current base URL
  getBaseUrl(): string {
    return this.baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    // Remove leading slash from endpoint if baseUrl exists
    const cleanEndpoint =
      endpoint.startsWith("/") && this.baseUrl ? endpoint.slice(1) : endpoint;

    const url = this.baseUrl ? `${this.baseUrl}/${cleanEndpoint}` : endpoint;

    // Log the request URL in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[API] ${options?.method || "GET"} ${url}`);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error: ApiError = {
          message:
            errorData.message || `HTTP error! status: ${response.status}`,
          status: response.status,
          details: errorData.details,
          error: errorData.error,
        };
        throw error;
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }
}

// Function to get API base URL
function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (process.env.NODE_ENV === "development") {
    console.log(
      `[API Client] Base URL: ${baseUrl || "(empty - using relative paths)"}`,
    );
  }
  return baseUrl;
}

// External API instance (backend) - initialized with environment variable
export const api = new ApiClient(getApiBaseUrl());

// Internal API instance (Next.js API routes)
export const internalApi = new ApiClient("");

// Helper to get the right API instance
export const getApi = (isInternal = false) => (isInternal ? internalApi : api);
