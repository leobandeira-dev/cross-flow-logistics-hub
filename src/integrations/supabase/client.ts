
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lxxslzdxzjoiptacurgn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4eHNsemR4empvaXB0YWN1cmduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MDQ0MDgsImV4cCI6MjA2MzA4MDQwOH0.WwtwUP862S8yMKglJ93wzCCyPT0Cp_5ZD0dMxJYmas8';

// Create a custom storage object that handles exceptions for preview environments
const customStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

// Create the Supabase client with a custom storage provider
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
  }
});
