
import React, { createContext, useContext } from 'react';
import { Usuario } from "@/types/supabase.types";
import { Session } from '@supabase/supabase-js';
import { SignUpCredentials } from '@/services/auth/authTypes';

// Define the shape of our auth context
export type AuthContextType = {
  user: Usuario | null;
  session: Session | null;
  loading: boolean;
  connectionError: boolean;
  authChecked: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  setUser: (user: Usuario | null) => void;
  verifyAuthState: () => void;
};

// Create the context with undefined as initial value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a hook to use the auth context
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext deve ser usado dentro de um AuthProvider');
  }
  return context;
};
