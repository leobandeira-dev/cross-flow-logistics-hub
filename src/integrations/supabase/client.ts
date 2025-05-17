
// This file is a mock version of the Supabase client for frontend-only development
import type { Database } from './types';

// Mock response function that returns a successful result
const mockSuccess = (data: any = null) => ({
  data,
  error: null
});

// Mock error function
const mockError = (message: string) => ({
  data: null,
  error: new Error(message || 'Método não implementado no modo frontend')
});

// Helper to create chainable query functions
const createQueryBuilder = () => {
  const queryBuilder: any = {
    select: () => queryBuilder,
    insert: () => queryBuilder,
    update: () => queryBuilder,
    delete: () => queryBuilder,
    upsert: () => queryBuilder,
    eq: () => queryBuilder,
    neq: () => queryBuilder,
    gt: () => queryBuilder,
    gte: () => queryBuilder,
    lt: () => queryBuilder,
    lte: () => queryBuilder,
    like: () => queryBuilder,
    ilike: () => queryBuilder,
    is: () => queryBuilder,
    in: () => queryBuilder,
    or: () => queryBuilder,
    and: () => queryBuilder,
    not: () => queryBuilder,
    contains: () => queryBuilder,
    containedBy: () => queryBuilder,
    overlaps: () => queryBuilder,
    textSearch: () => queryBuilder,
    match: () => queryBuilder,
    single: async () => mockSuccess(),
    maybeSingle: async () => mockSuccess(),
    order: () => queryBuilder,
    limit: () => queryBuilder,
    // Remove duplicate range property
    range: () => queryBuilder,
    then: (callback: any) => Promise.resolve(mockSuccess()).then(callback)
  };
  
  // Make the query builder also callable as a function that returns itself
  // @ts-ignore - This makes the object callable
  Object.defineProperty(queryBuilder, Symbol.toPrimitive, {
    value: () => async () => mockSuccess()
  });
  
  return queryBuilder;
};

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
  from: (table: string) => {
    return {
      ...createQueryBuilder(),
      select: (columns?: string) => createQueryBuilder(),
      update: (data?: any) => createQueryBuilder(),
      insert: (data?: any) => createQueryBuilder(),
      delete: () => createQueryBuilder()
    };
  }
};

// Helpers para tipagem mais segura e facilidade de uso
export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return (error as Error).message;
  }
  return String(error);
};
