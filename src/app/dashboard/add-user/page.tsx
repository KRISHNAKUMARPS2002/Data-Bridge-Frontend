"use client";

import { useState } from "react";
import { addUser, addBulkUsers } from "@/utils/api/users";
import { useRouter } from "next/navigation"; // Import useRouter
import { FaArrowRightLong } from "react-icons/fa6";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AddUserPage() {
  const router = useRouter();
  //For hour effect
  const [isHovered, setIsHovered] = useState(false);

  // State for single user form
  const [userForm, setUserForm] = useState({ username: "", password: "" });

  // State for bulk users
  const [bulkUsers, setBulkUsers] = useState("");

  // Combined message state
  const [message, setMessage] = useState({ text: "", type: "" });

  // Loading states
  const [singleLoading, setSingleLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Handler for single user submission
  async function handleUserSubmit(e) {
    e.preventDefault();
    setSingleLoading(true);

    try {
      await addUser(userForm);
      setUserForm({ username: "", password: "" });
      setMessage({ text: "User added successfully!", type: "success" });
    } catch (error) {
      console.error("Error adding user:", error);
      setMessage({ text: "Error adding user", type: "error" });
    } finally {
      setSingleLoading(false);
    }
  }

  // Handler for bulk users submission
  async function handleBulkUserSubmit(e) {
    e.preventDefault();
    setBulkLoading(true);

    try {
      // Validate and parse the JSON input
      const usersArray = JSON.parse(bulkUsers);
      if (!Array.isArray(usersArray)) {
        throw new Error("Input must be a valid JSON array");
      }

      // Validate structure of each user object
      for (const user of usersArray) {
        if (!user.username || !user.password) {
          throw new Error("Each user must have username and password fields");
        }
      }

      await addBulkUsers(usersArray);
      setBulkUsers("");
      setMessage({
        text: `Successfully added ${usersArray.length} users!`,
        type: "success",
      });
    } catch (error) {
      console.error("Error adding bulk users:", error);
      setMessage({
        text: `Error: ${error.message || "Failed to add users"}`,
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
      <div className="min-h-screen bg-gray-100 py-8 ">
        <div className="container mx-auto">
          {/* Combined message display at the top */}
          {message.text && (
            <div
              className={`p-4 mb-4 pt-20 rounded ${
                message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Single User Section */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Add User</h2>

            <form onSubmit={handleUserSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  placeholder="Username"
                  value={userForm.username}
                  onChange={(e) =>
                    setUserForm({ ...userForm, username: e.target.value })
                  }
                  required
                  className="w-full border p-2 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Password</label>
                <input
                  type="text"
                  placeholder="Password"
                  value={userForm.password}
                  onChange={(e) =>
                    setUserForm({ ...userForm, password: e.target.value })
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
                    ? "bg-blue-400"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white px-4 py-2 rounded`}
              >
                {singleLoading ? "Adding..." : "Add User"}
              </button>
            </form>
          </div>

          {/* Bulk Users Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Add Multiple Users</h2>

            <form onSubmit={handleBulkUserSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Paste JSON Array of Users
                </label>
                <textarea
                  placeholder='[{"username": "user1", "password": "pass1"}, {"username": "user2", "password": "pass2"}]'
                  value={bulkUsers}
                  onChange={(e) => setBulkUsers(e.target.value)}
                  required
                  className="w-full border p-2 rounded font-mono text-sm h-64"
                />
              </div>

              <div className="mb-4 text-sm text-gray-600">
                <p>
                  Format: JSON array where each object has username and password
                  fields
                </p>
                <pre className="bg-gray-100 p-2 rounded mt-2">
                  {`[
  {"username": "user1", "password": "pass1"},
  {"username": "user2", "password": "pass2"},
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
                {bulkLoading ? "Processing..." : "Add Bulk Users"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
