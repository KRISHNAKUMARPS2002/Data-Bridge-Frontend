"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [logoutAlert, setLogoutAlert] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        {/* Navbar */}
        <nav className="bg-gradient-to-r from-[#4D55CC] to-[#AA60C8] shadow-md p-4 ">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-bold text-[#fff]">Dashboard</h1>
            </div>
            {/* Navigation Links */}
            <div className="flex space-x-4">
              <Link
                href="/dashboard/users"
                className="text-[#fff] hover:text-[#fff] px-8 rounded-lg py-2 bg-[#ffffff22] font-medium"
              >
                Users
              </Link>
              <Link
                href="/dashboard/customers"
                className="text-[#fff] hover:text-[#fff] px-8 rounded-lg py-2 bg-[#ffffff22] font-medium"
              >
                Customers
              </Link>
              <Link
                href="/dashboard/add-user"
                className="text-[#fff] hover:text-[#fff] px-8 rounded-lg py-2 bg-[#ffffff22] font-medium"
              >
                Add User
              </Link>
              <Link
                href="/dashboard/add-customer"
                className="text-[#fff] hover:text-[#fff] px-8 rounded-lg py-2 bg-[#ffffff22] font-medium"
              >
                Add Customer
              </Link>
            </div>

            <div className="flex items-center">
              <div className="mr-4 flex items-center">
                <span className="font-base flex items-center gap-2 text-[#fff] mr-2 bg-[#ffffff25] rounded-full px-6 py-2">
                  <span className="text-xl text-[#fff]">
                    <FaUserCircle />
                  </span>{" "}
                  {user?.email ?? "Guest"}
                </span>
                <span className="ml-3 px-6 py-2 bg-[#ffffff25] rounded-3xl text-[#fff] font-medium">
                  ID: {user?.db_id ?? "N/A"}
                </span>
              </div>
              <button
                onClick={() => setLogoutAlert(!logoutAlert)}
                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        {logoutAlert && (
          <div className="fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center w-full h-full z-50 bg-[#0000004e] backdrop-blur-sm">
            <div className="max-w-[400px] flex flex-col justify-center items-center w-full h-[200px] bg-[#ffffff7e] backdrop-blur-3xl rounded-3xl relative z-[999]">
              <div className="mb-3">Are you sure want to logout ?</div>
              <div className="flex justify-center items-center gap-5">
                <button
                  onClick={() => setLogoutAlert(!logoutAlert)}
                  className="px-6 py-2 rounded-lg bg-[#4D55CC] cursor-pointer font-semibold text-[#fff]"
                >
                  No
                </button>
                <button
                  onClick={logout}
                  className="px-6 py-2 rounded-lg bg-[#ff0000] cursor-pointer font-semibold text-[#fff]"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Overview */}
        <main className="container mx-auto p-4 mt-8">
          <div className="bg-gradient-to-r from-[#4D55CC] to-[#AA60C8] p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-[#fff]">
              Welcome to Dashboard
            </h2>
            <p className="text-[#fff]">
              Use the navigation links above to manage users and customers.
            </p>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
