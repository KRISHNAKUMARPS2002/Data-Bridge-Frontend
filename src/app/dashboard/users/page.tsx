"use client";

import { useState, useEffect } from "react";
import { fetchUsers } from "@/utils/api/users";
import { useRouter } from "next/navigation"; // Import useRouter
import { FaArrowRightLong } from "react-icons/fa6";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function UsersPage() {
  const router = useRouter();
  //For hour effect
  const [isHovered, setIsHovered] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await fetchUsers();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading users:", error);
        setError("Failed to load users");
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  return (
    <ProtectedRoute>
      {/* Back to Dashboard Button */}
      <div className="text-center py-5 mb-5 flex justify-center bg-gradient-to-r from-[#4D55CC] to-[#AA60C8] shadow-md p-4 fixed top-0 left-0 right-0 z-10">
        <button
          onClick={() => router.push("/dashboard")}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="bg-[#ffffff19] hover:bg-[#ffffff19] flex items-center gap-2 justify-center text-white px-4 py-2 rounded transition-all duration-300"
        >
          Back to Dashboard
          {isHovered && (
            <span className="transition-all duration-300 opacity-100">
              <FaArrowRightLong />
            </span>
          )}
        </button>
      </div>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Users</h2>

            {error && (
              <div className="p-4 pt-20 mb-4 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            {loading ? (
              <p>Loading users...</p>
            ) : (
              <div className="max-h-[600px] ScrollBar overflow-auto border border-gray-200 rounded-lg shadow-md">
                <table className="min-w-full bg-white ScrollBar">
                  {/* ✅ Sticky Header */}
                  <thead className="bg-gradient-to-r from-[#4D55CC] to-[#AA60C8] text-white sticky top-0 z-10">
                    <tr>
                      <th className="py-3 px-4 text-left">ID</th>
                      <th className="py-3 px-4 text-left">Username</th>
                      <th className="py-3 px-4 text-left">Password</th>
                    </tr>
                  </thead>

                  {/* ✅ Scrollable Body */}
                  <tbody className="divide-y divide-gray-200">
                    {users.length > 0 ? (
                      users.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-100 transition duration-200"
                        >
                          <td className="py-3 px-4">{user.id}</td>
                          <td className="py-3 px-4">{user.username}</td>
                          <td className="py-3 px-4">{user.password}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="py-6 text-center text-gray-500"
                        >
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
