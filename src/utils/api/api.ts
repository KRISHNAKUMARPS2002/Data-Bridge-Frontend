import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
} from "@/utils/storage";
import { refreshAccessToken, logoutUser } from "./auth";

export const API_URL = "https://sysmac.co.in/api";

// ✅ Function to make API requests with auto-refresh on 401
export async function apiRequest<T>(
  endpoint: string,
  method: string = "GET",
  body?: any,
  requireAuth: boolean = true
): Promise<T> {
  let accessToken = getLocalStorage("accessToken");

  if (requireAuth && !accessToken) {
    console.warn("❌ No access token, logging out...");
    logoutUser();
    throw new Error("Unauthorized: No access token.");
  }

  const makeRequest = async (token?: string) => {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (requireAuth && token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  };

  let response = await makeRequest(accessToken);

  if (requireAuth && response.status === 401) {
    try {
      console.warn("⚠️ Access token expired, refreshing...");
      accessToken = await refreshAccessToken(); // 🔄 Try refreshing token
      response = await makeRequest(accessToken);
    } catch (error) {
      console.error("❌ Session expired. Logging out...");
      logoutUser();
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (requireAuth && response.status === 403) {
    console.error("❌ Invalid token. Logging out...");
    logoutUser();
    throw new Error("Invalid session. Please log in again.");
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Unknown API Error");
  }

  return (await response.json()) as T; // ✅ Fixed return type
}
