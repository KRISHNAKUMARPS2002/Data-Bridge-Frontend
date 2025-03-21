"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  User,
} from "@/utils/api/auth";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string
  ) => Promise<void>;
  refreshToken: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  refreshToken: async () => {},
  loading: false,
  error: null,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // ✅ Memoized refreshToken function
  const refreshToken = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return;

    try {
      const data = await refreshAccessToken(refreshToken);
      localStorage.setItem("accessToken", data.accessToken);
      // If the API returns a new refresh token too (recommended):
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      console.log("Token refreshed");
      return data;
    } catch (error) {
      console.error("Token refresh failed", error);
      await logout();
    }
  }, []);

  // ✅ Memoized checkAndRefreshToken function
  const checkAndRefreshToken = useCallback(async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    try {
      const tokenParts = JSON.parse(atob(accessToken.split(".")[1]));
      const exp = tokenParts.exp * 1000; // Convert to milliseconds

      if (Date.now() >= exp - 60000) {
        await refreshToken();
      }
    } catch (error) {
      console.error("Error checking token expiration:", error);
    }
  }, [refreshToken]);

  // ✅ Effect to load user and refresh token on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));

      (async () => {
        await checkAndRefreshToken();
      })();
    }

    setLoading(false);
  }, [checkAndRefreshToken]);

  // ✅ NEW: Set up an interval to check and refresh the token periodically
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    // Only set up the interval if the user is logged in
    if (user) {
      // Check and refresh token every 10 minutes (adjust as needed)
      // This should be less than your access token expiry time
      // For a 15-minute token, refresh every 10 minutes is good
      intervalId = setInterval(() => {
        console.log("🔄 Checking token expiration...");
        checkAndRefreshToken();
      }, 10 * 60 * 1000);

      console.log("✅ Token refresh interval set up");
    }

    // Clean up interval when component unmounts or user logs out
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        console.log("🛑 Token refresh interval cleared");
      }
    };
  }, [user, checkAndRefreshToken]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser({ email, password });

      if (!data || !data.accessToken || !data.refreshToken) {
        throw new Error("Login failed. Please try again.");
      }

      const userData = { email: data.email, db_id: data.db_id };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    username: string,
    password: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const data = await registerUser({ email, username, password });

      if (!data || !data.accessToken || !data.refreshToken) {
        throw new Error("Registration failed. Please try again.");
      }

      const userData = { email: data.email, db_id: data.db_id };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Register error:", error);
      setError(error?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      await logoutUser();
      setUser(null);
      localStorage.clear();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setError("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, refreshToken, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
