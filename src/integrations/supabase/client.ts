
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lxxslzdxzjoiptacurgn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4eHNsemR4empvaXB0YWN1cmduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MDQ0MDgsImV4cCI6MjA2MzA4MDQwOH0.WwtwUP862S8yMKglJ93wzCCyPT0Cp_5ZD0dMxJYmas8';

// Create a more robust storage object that uses memory fallback
// when localStorage is not available due to security restrictions
const createSafeStorage = () => {
  // In-memory storage fallback
  const inMemoryStorage = new Map<string, string>();

  // Detect if localStorage is actually available and working
  const isLocalStorageAvailable = (): boolean => {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('localStorage not available, using in-memory storage instead');
      return false;
    }
  };

  const localStorageAvailable = isLocalStorageAvailable();

  return {
    getItem: (key: string): string | null => {
      try {
        if (localStorageAvailable) {
          return localStorage.getItem(key);
        }
        return inMemoryStorage.get(key) || null;
      } catch (error) {
        console.error('Error accessing storage:', error);
        return inMemoryStorage.get(key) || null;
      }
    },
    setItem: (key: string, value: string): void => {
      try {
        if (localStorageAvailable) {
          localStorage.setItem(key, value);
        }
        inMemoryStorage.set(key, value);
      } catch (error) {
        console.error('Error setting storage:', error);
        inMemoryStorage.set(key, value);
      }
    },
    removeItem: (key: string): void => {
      try {
        if (localStorageAvailable) {
          localStorage.removeItem(key);
        }
        inMemoryStorage.delete(key);
      } catch (error) {
        console.error('Error removing from storage:', error);
        inMemoryStorage.delete(key);
      }
    }
  };
};

// Create the Supabase client with the safe storage provider
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createSafeStorage(),
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
  }
});
