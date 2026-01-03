// /lib/localStorage.ts

export const LocalStore = {
  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;

    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error("LocalStorage get error:", error);
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("LocalStorage set error:", error);
    }
  },

  remove(key: string): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("LocalStorage remove error:", error);
    }
  },

  clear(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.clear();
    } catch (error) {
      console.error("LocalStorage clear error:", error);
    }
  },
};
