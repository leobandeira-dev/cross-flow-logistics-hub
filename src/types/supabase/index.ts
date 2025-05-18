
// Re-export all types from the separate files
export * from './base.types';
export * from './company.types';
export * from './user.types';
export * from './transport.types';
export * from './coleta.types';
export * from './fiscal.types';
export * from './shipping.types';
export * from './warehouse.types';
export * from './occurrence.types';

// Export Database type for compatibility
export type Database = {
  public: {
    Tables: {
      // Tables will be added here if needed
    }
  }
};
