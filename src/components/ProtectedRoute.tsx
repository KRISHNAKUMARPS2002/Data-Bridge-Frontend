"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Adjust the path based on your project

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, loading } = useAuth(); // Assuming useAuth() provides auth state

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [user, loading, router]);

  if (loading) return <p>Loading...</p>; // Show loading indicator

  return <>{user ? children : null}</>;
};

export default ProtectedRoute;
