"use client";

import { useState, useEffect } from "react";

import { fetchUsers, addUser, addBulkUsers } from "@/utils/api/users";

import {
  fetchCustomers,
  addCustomer,
  addBulkCustomers,
} from "@/utils/api/customers";

export default function APIInterface() {
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [userForm, setUserForm] = useState({ username: "", password: "" });
  const [customerForm, setCustomerForm] = useState({
    name: "",
    address: "",
    place: "",
    phone: "",
  });

  // For Bulk Input
  const [bulkUsers, setBulkUsers] = useState("");
  const [bulkCustomers, setBulkCustomers] = useState("");

  useEffect(() => {
    loadUsers();
    loadCustomers();
  }, []);

  async function loadUsers() {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  }

  async function loadCustomers() {
    try {
      const data = await fetchCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Error loading customers:", error);
    }
  }

  async function handleUserSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await addUser(userForm);
      loadUsers();
      setUserForm({ username: "", password: "" });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  }

  async function handleCustomerSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await addCustomer(customerForm);
      loadCustomers();
      setCustomerForm({ name: "", address: "", place: "", phone: "" });
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  }

  async function handleBulkUserSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const usersArray = JSON.parse(bulkUsers);
      if (!Array.isArray(usersArray)) throw new Error("Invalid format");
      await addBulkUsers(usersArray);
      loadUsers();
      setBulkUsers("");
    } catch (error) {
      console.error("Error adding bulk users:", error);
      alert("Invalid format! Please provide a valid JSON array.");
    }
  }

  async function handleBulkCustomerSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const customersArray = JSON.parse(bulkCustomers);
      if (!Array.isArray(customersArray)) throw new Error("Invalid format");
      await addBulkCustomers(customersArray);
      loadCustomers();
      setBulkCustomers("");
    } catch (error) {
      console.error("Error adding bulk customers:", error);
      alert("Invalid format! Please provide a valid JSON array.");
    }
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">API Interface</h2>

      {/* User Form */}
      <form onSubmit={handleUserSubmit} className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Add User</h3>
        <input
          type="text"
          placeholder="Username"
          value={userForm.username}
          onChange={(e) =>
            setUserForm({ ...userForm, username: e.target.value })
          }
          required
          className="w-full border p-2 mb-2 rounded"
        />
        <input
          type="text"
          placeholder="Password"
          value={userForm.password}
          onChange={(e) =>
            setUserForm({ ...userForm, password: e.target.value })
          }
          required
          className="w-full border p-2 mb-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add User
        </button>
      </form>

      {/* Bulk User Form */}
      <form onSubmit={handleBulkUserSubmit} className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Add Bulk Users</h3>
        <textarea
          placeholder='Paste JSON array: [{"username": "user1", "password": "pass1"}, {"username": "user2", "password": "pass2"}]'
          value={bulkUsers}
          onChange={(e) => setBulkUsers(e.target.value)}
          required
          className="w-full border p-2 mb-2 rounded h-32"
        />
        <button
          type="submit"
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Add Bulk Users
        </button>
      </form>

      {/* Customer Form */}
      <form onSubmit={handleCustomerSubmit} className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Add Customer</h3>
        <input
          type="text"
          placeholder="Name"
          value={customerForm.name}
          onChange={(e) =>
            setCustomerForm({ ...customerForm, name: e.target.value })
          }
          required
          className="w-full border p-2 mb-2 rounded"
        />
        <input
          type="text"
          placeholder="Address"
          value={customerForm.address}
          onChange={(e) =>
            setCustomerForm({ ...customerForm, address: e.target.value })
          }
          required
          className="w-full border p-2 mb-2 rounded"
        />
        <input
          type="text"
          placeholder="Place"
          value={customerForm.place}
          onChange={(e) =>
            setCustomerForm({ ...customerForm, place: e.target.value })
          }
          required
          className="w-full border p-2 mb-2 rounded"
        />
        <input
          type="text"
          placeholder="Phone"
          value={customerForm.phone}
          onChange={(e) =>
            setCustomerForm({ ...customerForm, phone: e.target.value })
          }
          required
          className="w-full border p-2 mb-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Customer
        </button>
      </form>

      {/* Bulk Customer Form */}
      <form onSubmit={handleBulkCustomerSubmit} className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Add Bulk Customers</h3>
        <textarea
          placeholder='Paste JSON array: [{"name": "John Doe", "address": "123 Street", "place": "NY", "phone": "1234567890"}, {...}]'
          value={bulkCustomers}
          onChange={(e) => setBulkCustomers(e.target.value)}
          required
          className="w-full border p-2 mb-2 rounded h-32"
        />
        <button
          type="submit"
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Add Bulk Customers
        </button>
      </form>
    </div>
  );
}
