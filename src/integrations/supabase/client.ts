
// This file is a mock version of the Supabase client for frontend-only development
import type { Database } from './types';

// Mock client para desenvolvimento frontend sem backend
export const supabase = {
  auth: {
    getSession: async () => ({ 
      data: { session: null }, 
      error: null 
    }),
    getUser: async () => ({ 
      data: { user: null }, 
      error: null 
    }),
    onAuthStateChange: (callback: any) => {
      // Mock do listener que não faz nada
      return { 
        data: { 
          subscription: { 
            unsubscribe: () => {} 
          } 
        } 
      };
    },
    signInWithPassword: async () => ({
      data: { user: null, session: null },
      error: new Error('Método não implementado no modo frontend')
    }),
    signUp: async () => ({
      data: { user: null, session: null },
      error: new Error('Método não implementado no modo frontend')
    }),
    signOut: async () => ({
      error: null
    }),
    resetPasswordForEmail: async () => ({
      error: null
    }),
    updateUser: async () => ({
      error: null
    }),
    setSession: async () => ({
      data: { user: null, session: null },
      error: new Error('Método não implementado no modo frontend')
    })
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        maybeSingle: async () => ({
          data: null,
          error: new Error('Método não implementado no modo frontend')
        })
      })
    }),
    update: () => ({
      eq: async () => ({
        error: new Error('Método não implementado no modo frontend')
      })
    })
  })
};

// Helpers para tipagem mais segura e facilidade de uso
export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return (error as Error).message;
  }
  return String(error);
};
