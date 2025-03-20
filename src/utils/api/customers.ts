import { apiRequest } from "./api";

interface Customer {
  name: string;
  address: string;
  place: string;
  phone: string;
}

// 🔹 Fetch all customers
export async function fetchCustomers() {
  return await apiRequest<Customer[]>("/customers/list", "GET");
}

// 🔹 Add a single customer
export async function addCustomer(customer: Customer) {
  return await apiRequest<Customer>("/customers/single", "POST", customer);
}

// 🔹 Add multiple customers in bulk
export async function addBulkCustomers(customers: Customer[]) {
  return await apiRequest<{ success: boolean }>("/customers/bulk", "POST", {
    customers,
  });
}
