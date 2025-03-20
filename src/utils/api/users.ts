import { apiRequest } from "./api";

interface User {
  username: string;
  password: string;
}

// 🔹 Fetch all users
export async function fetchUsers() {
  return await apiRequest<User[]>("/users/list", "GET");
}

// 🔹 Add a single user
export async function addUser(user: User) {
  return await apiRequest<User>("/users/single", "POST", user);
}

// 🔹 Add multiple users in bulk
export async function addBulkUsers(users: User[]) {
  return await apiRequest<{ success: boolean }>("/users/bulk", "POST", {
    users,
  });
}
