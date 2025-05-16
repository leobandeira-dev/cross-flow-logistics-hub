
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import authService from '@/services/auth';
import { Usuario } from '@/types/supabase.types';
import { Session } from '@supabase/supabase-js';

export const useAuthState = () => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event, newSession ? 'session exists' : 'no session');
      
      // Update session state immediately
      setSession(newSession);
      
      if (newSession) {
        // Immediately update loading state to show we're working
        setLoading(true);
        
        try {
          console.log('Fetching user data after auth state change');
          const userData = await authService.getCurrentUser();
          console.log('User data fetched:', userData);
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data after state change:', error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('No session in auth state change, clearing user state');
        setUser(null);
        setLoading(false);
      }
    });

    // Then check for existing session
    const checkUser = async () => {
      try {
        console.log('Checking for existing session');
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (existingSession) {
          console.log('Existing session found, fetching user data');
          setSession(existingSession);
          const userData = await authService.getCurrentUser();
          console.log('User data fetched for existing session:', userData);
          setUser(userData);
        } else {
          console.log('No existing session found');
          setUser(null);
          setSession(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    return () => {
      console.log('Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, setUser, loading, setLoading };
};
