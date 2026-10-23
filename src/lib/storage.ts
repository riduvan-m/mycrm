import { useEffect, useState } from 'react';

/** useState that is saved to localStorage, used until the backend has APIs for this data. */
export function usePersistentState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved) as T;
    } catch {
      // Storage unavailable or corrupt; fall back to sample data.
    }
    return fallback;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore: the page still works, it just won't survive a reload.
    }
  }, [key, value]);

  return [value, setValue] as const;
}

// crypto.randomUUID only exists on https/localhost, so it fails when testing from a phone over the LAN.
export const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
