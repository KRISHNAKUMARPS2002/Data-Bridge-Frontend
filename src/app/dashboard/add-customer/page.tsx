"use client";

import { useState } from "react";
import { addCustomer, addBulkCustomers } from "@/utils/api/customers";
import { useRouter } from "next/navigation"; // Import useRouter
import { FaArrowRightLong } from "react-icons/fa6";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AddCustomerPage() {
  const router = useRouter();

  //For hour effect
  const [isHovered, setIsHovered] = useState(false);

  // State for single customer form
  const [customerForm, setCustomerForm] = useState({
    name: "",
    address: "",
    place: "",
    phone: "",
  });

  // State for bulk customers
  const [bulkCustomers, setBulkCustomers] = useState("");

  // Combined message state
  const [message, setMessage] = useState({ text: "", type: "" });

  // Loading states
  const [singleLoading, setSingleLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Handler for single customer submission
  async function handleCustomerSubmit(e) {
    e.preventDefault();
    setSingleLoading(true);

    try {
      await addCustomer(customerForm);
      setCustomerForm({ name: "", address: "", place: "", phone: "" });
      setMessage({ text: "Customer added successfully!", type: "success" });
    } catch (error) {
      console.error("Error adding customer:", error);
      setMessage({ text: "Error adding customer", type: "error" });
    } finally {
      setSingleLoading(false);
    }
  }

  // Handler for bulk customers submission
  async function handleBulkCustomerSubmit(e) {
    e.preventDefault();
    setBulkLoading(true);

    try {
      // Validate and parse the JSON input
      const customersArray = JSON.parse(bulkCustomers);
      if (!Array.isArray(customersArray)) {
        throw new Error("Input must be a valid JSON array");
      }

      // Validate structure of each customer object
      for (const customer of customersArray) {
        if (
          !customer.name ||
          !customer.address ||
          !customer.place ||
          !customer.phone
        ) {
          throw new Error(
            "Each customer must have name, address, place, and phone fields"
          );
        }
      }

      await addBulkCustomers(customersArray);
      setBulkCustomers("");
      setMessage({
        text: `Successfully added ${customersArray.length} customers!`,
        type: "success",
      });
    } catch (error) {
      console.error("Error adding bulk customers:", error);
      setMessage({
        text: `Error: ${error.message || "Failed to add customers"}`,
        type: "error",
      });
    } finally {
      setBulkLoading(false);
    }
  }

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
          {/* Combined message display at the top */}
          {message.text && (
            <div
              className={`p-4 pt-20 mb-4 rounded ${
                message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Single Customer Section */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Add Customer</h2>

            <form onSubmit={handleCustomerSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  value={customerForm.name}
                  onChange={(e) =>
                    setCustomerForm({ ...customerForm, name: e.target.value })
                  }
                  required
                  className="w-full border p-2 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  placeholder="Address"
                  value={customerForm.address}
                  onChange={(e) =>
                    setCustomerForm({
                      ...customerForm,
                      address: e.target.value,
                    })
                  }
                  required
                  className="w-full border p-2 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Place</label>
                <input
                  type="text"
                  placeholder="Place"
                  value={customerForm.place}
                  onChange={(e) =>
                    setCustomerForm({ ...customerForm, place: e.target.value })
                  }
                  required
                  className="w-full border p-2 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  placeholder="Phone"
                  value={customerForm.phone}
                  onChange={(e) =>
                    setCustomerForm({ ...customerForm, phone: e.target.value })
                  }
                  required
                  className="w-full border p-2 rounded"
                />
              </div>

              <button
                type="submit"
                disabled={singleLoading}
                className={`${
                  singleLoading
                    ? "bg-green-400"
                    : "bg-green-500 hover:bg-green-600"
                } text-white px-4 py-2 rounded`}
              >
                {singleLoading ? "Adding..." : "Add Customer"}
              </button>
            </form>
          </div>

          {/* Bulk Customers Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Add Multiple Customers</h2>

            <form onSubmit={handleBulkCustomerSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Paste JSON Array of Customers
                </label>
                <textarea
                  placeholder='[{"name": "John Doe", "address": "123 Main St", "place": "New York", "phone": "123-456-7890"}, {"name": "Jane Smith", "address": "456 Oak Ave", "place": "Chicago", "phone": "987-654-3210"}]'
                  value={bulkCustomers}
                  onChange={(e) => setBulkCustomers(e.target.value)}
                  required
                  className="w-full border p-2 rounded font-mono text-sm h-64"
                />
              </div>

              <div className="mb-4 text-sm text-gray-600">
                <p>
                  Format: JSON array where each object has name, address, place,
                  and phone fields
                </p>
                <pre className="bg-gray-100 p-2 rounded mt-2">
                  {`[
  {
    "name": "John Doe",
    "address": "123 Main St",
    "place": "New York",
    "phone": "123-456-7890"
  },
  {
    "name": "Jane Smith",
    "address": "456 Oak Ave",
    "place": "Chicago", 
    "phone": "987-654-3210"
  },
  ...
]`}
                </pre>
              </div>

              <button
                type="submit"
                disabled={bulkLoading}
                className={`${
                  bulkLoading
                    ? "bg-purple-400"
                    : "bg-purple-500 hover:bg-purple-600"
                } text-white px-4 py-2 rounded`}
              >
                {bulkLoading ? "Processing..." : "Add Bulk Customers"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
