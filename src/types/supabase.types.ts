
// Re-export all types from the new modular structure
// This file is maintained for backward compatibility

export * from './supabase/index';
export * from './supabase/database.types';

// Re-export the main types for convenience
export type { NotaFiscal, ItemNotaFiscal } from './supabase/fiscal.types';
