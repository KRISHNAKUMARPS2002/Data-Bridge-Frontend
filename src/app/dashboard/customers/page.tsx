"use client";

import { useState, useEffect } from "react";
import { fetchCustomers } from "@/utils/api/customers";
import { useRouter } from "next/navigation"; // Import useRouter
import { FaArrowRightLong } from "react-icons/fa6";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CustomersPage() {
  const router = useRouter();
  //For hour effect
  const [isHovered, setIsHovered] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCustomers() {
      try {
        const data = await fetchCustomers();
        setCustomers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading customers:", error);
        setError("Failed to load customers");
        setLoading(false);
      }
    }

    loadCustomers();
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
            <h2 className="text-xl font-bold mb-4">Customers</h2>

            {error && (
              <div className="p-4 pt-20 mb-4 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            {loading ? (
              <p>Loading customers...</p>
            ) : (
              <div className="max-h-[600px] ScrollBar overflow-auto border border-gray-200 rounded-lg shadow-md">
                <table className="min-w-full bg-white ScrollBar">
                  {/* ✅ Sticky Header */}
                  <thead className="bg-gradient-to-r from-[#4D55CC] to-[#AA60C8] text-white sticky top-0 z-10">
                    <tr>
                      <th className="py-3 px-4 text-left font-semibold">ID</th>
                      <th className="py-3 px-4 text-left font-semibold">
                        Name
                      </th>
                      <th className="py-3 px-4 text-left font-semibold">
                        Address
                      </th>
                      <th className="py-3 px-4 text-left font-semibold">
                        Place
                      </th>
                      <th className="py-3 px-4 text-left font-semibold">
                        Phone
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {customers.length > 0 ? (
                      customers.map((customer) => (
                        <tr
                          key={customer.id}
                          className="hover:bg-gray-100 transition duration-200"
                        >
                          <td className="py-3 px-4">{customer.id}</td>
                          <td className="py-3 px-4">{customer.name}</td>
                          <td className="py-3 px-4">{customer.address}</td>
                          <td className="py-3 px-4">{customer.place}</td>
                          <td className="py-3 px-4">{customer.phone}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-6 text-center text-gray-500"
                        >
                          No customers found
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
