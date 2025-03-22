"use client";

import Navigation from "@/components/Navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-screen bg-gray-100">
      <Navigation />
      <main className="flex-grow h-[80vh] flex  justify-center items-center mx-auto">
        <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
      </main>
      <footer className="bg-white p-4 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Your Application</p>
      </footer>
    </div>
  );
}
