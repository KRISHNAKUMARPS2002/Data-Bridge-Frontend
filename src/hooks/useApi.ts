"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { refreshAccessToken } from "@/utils/api/auth";

export const API_URL = "https://sysmac.co.in/api";

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

interface ApiHook {
  fetchWithAuth: <T>(endpoint: string, options?: FetchOptions) => Promise<T>;
  loading: boolean;
  error: string | null;
}

export function useApi(): ApiHook {
  const { user, logout } = useAuth(); // Assuming you have a logout function in AuthContext
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWithAuth = useCallback(
    async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
      if (!user) {
        throw new Error("Not authenticated");
      }

      setLoading(true);
      setError(null);

      try {
        let accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          try {
            const refreshResult = await refreshAccessToken();
            accessToken = refreshResult.accessToken;
            if (!accessToken) throw new Error("Failed to refresh token");
          } catch (refreshError) {
            logout();
            throw new Error("Session expired. please log in again.");
          }
        }

        const headers: Record<string, string> = {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          ...options.headers,
        };

        const fullUrl = `${API_URL.replace(/\/$/, "")}/${endpoint.replace(
          /^\//,
          ""
        )}`;

        let response = await fetch(fullUrl, {
          ...options,
          headers,
        });

        // If token is expired (401), try refreshing it
        if (response.status === 401) {
          try {
            await refreshAccessToken();
            accessToken = localStorage.getItem("accessToken");

            if (accessToken) {
              headers.Authorization = `Bearer ${accessToken}`;

              // Retry the request with the new token
              response = await fetch(fullUrl, {
                ...options,
                headers,
              });

              if (!response.ok) {
                throw new Error("Request failed after token refresh");
              }

              return await response.json();
            } else {
              throw new Error("Token refresh failed");
            }
          } catch (refreshError) {
            logout(); // Log out user if refresh fails
            throw new Error("Session expired. Please log in again.");
          }
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || "Request failed");
        }

        return await response.json();
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, logout]
  );

  return {
    fetchWithAuth,
    loading,
    error,
  };
}
