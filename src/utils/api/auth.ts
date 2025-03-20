import {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
} from "@/utils/storage";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface UserData {
  email: string;
  username: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  db_id: string;
  user: { email: string; db_id: string };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  db_id: string;
}

// ✅ Register User & Auto Login
export async function registerUser(userData: UserData): Promise<AuthResponse> {
  try {
    // Step 1: Register user
    const registerResponse = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!registerResponse.ok) {
      const error = await registerResponse.json();
      throw new Error(error.error || "Registration failed");
    }

    // Step 2: Extract user credentials (if needed)
    const registeredUser = await registerResponse.json();

    // Step 3: Automatically log in after registration
    const loginResponse = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password, // Using the same password for login
      }),
    });

    if (!loginResponse.ok) {
      throw new Error("Auto-login failed after registration");
    }

    const authData = await loginResponse.json();

    // Step 4: Store tokens in localStorage or cookies
    localStorage.setItem("accessToken", authData.accessToken);
    localStorage.setItem("refreshToken", authData.refreshToken);

    return authData; // Return tokens to update AuthContext
  } catch (error) {
    console.error("❌ Register Error:", error);
    throw new Error("Failed to register user");
  }
}

// ✅ Login User
export async function loginUser(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    const data = await response.json();

    // ✅ Store tokens using helper functions
    setLocalStorage("accessToken", data.accessToken);
    setLocalStorage("refreshToken", data.refreshToken);
    setLocalStorage(
      "user",
      JSON.stringify({ email: data.email, db_id: data.db_id })
    );

    // ✅ Start auto-refreshing the token
    startTokenRefresh();

    return data;
  } catch (error) {
    console.error("❌ Login Error:", error);
    throw new Error("Failed to login");
  }
}

// ✅ Logout User
export function logoutUser() {
  console.log("🚪 Logging out user...");
  removeLocalStorage("accessToken");
  removeLocalStorage("refreshToken");
  removeLocalStorage("user");

  // ❌ Stop token refreshing when user logs out
  if (refreshInterval != null) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}

// ✅ Refresh Access Token
export async function refreshAccessToken(providedToken?: string): Promise<any> {
  const refreshToken = providedToken || getLocalStorage("refreshToken");

  if (!refreshToken) {
    console.warn("❌ No refresh token found, logging out...");
    logoutUser();
    return Promise.reject("No refresh token available.");
  }

  try {
    console.log("🔄 Refreshing access token...");
    const response = await fetch(`${API_URL}/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      console.warn("⚠️ Refresh token invalid. Logging out...");
      logoutUser();
      return Promise.reject("Invalid refresh token.");
    }

    const data = await response.json();
    setLocalStorage("accessToken", data.accessToken);
    return data;
  } catch (error) {
    console.error("❌ Refresh Token Error:", error);
    logoutUser();
    return Promise.reject("Session expired. Please log in again.");
  }
}

//New one
export function isTokenExpired(token: string): boolean {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000; // Convert to milliseconds

    // Return true if current time is past expiration (with 60s buffer)
    return Date.now() >= expiry - 60000;
  } catch (e) {
    console.error("Error checking token expiration:", e);
    return true; // If we can't check, assume it's expired to be safe
  }
}

// ✅ Auto-Refresh Token Every 14 Minutes
let refreshInterval: NodeJS.Timeout | null = null;

export function startTokenRefresh() {
  if (refreshInterval) return; // Avoid multiple intervals

  refreshInterval = setInterval(async () => {
    try {
      console.log("🔄 Auto-refreshing access token...");
      await refreshAccessToken();
    } catch (error) {
      console.error("❌ Auto-refresh failed:", error);
    }
  }, 14 * 60 * 1000); // Refresh every 14 minutes
}

// ✅ Refresh Token on Page Reload
export function refreshOnLoad() {
  if (getLocalStorage("refreshToken")) {
    refreshAccessToken()
      .then(() => startTokenRefresh())
      .catch(() => console.error("❌ Failed to refresh on page load"));
  }
}
