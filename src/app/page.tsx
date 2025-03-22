// Layout component for authenticated pages

"use client";

import { ReactNode } from "react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/context/AuthContext";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navigation />
      <main className="flex-grow container mx-auto p-4 mt-4">{children}</main>
      <footer className="bg-white p-4 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Your Application</p>
      </footer>
    </div>
  );
}
