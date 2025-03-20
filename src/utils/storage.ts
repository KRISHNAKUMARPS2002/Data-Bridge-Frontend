// ✅ Store a value in localStorage
export const setLocalStorage = (key: string, value: any) => {
  if (typeof window !== "undefined") {
    const storedValue =
      typeof value === "object" ? JSON.stringify(value) : value;
    localStorage.setItem(key, storedValue);
  }
};

// ✅ Get a value from localStorage
export const getLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    const storedValue = localStorage.getItem(key);
    try {
      return storedValue ? JSON.parse(storedValue) : null;
    } catch {
      return storedValue; // Return as string if parsing fails
    }
  }
  return null;
};

// ✅ Remove a value from localStorage
export const removeLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};
