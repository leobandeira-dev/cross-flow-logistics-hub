
// Re-export Json type from base.types
export type { Json } from './base.types';

// Re-export all other types from the separate files
export * from './company.types';
export * from './user.types';
export * from './transport.types';
export * from './coleta.types';
export * from './fiscal.types';
export * from './warehouse.types';
export * from './occurrence.types';

// Export database types, but exclude Json to avoid duplication
export * from './database.types';

// Export shipping types with proper naming to avoid conflicts
export type {
  OrdemCarregamento,
  ItemCarregamento,
  Carregamento,
  EnderecamentoCaminhaoShipping as EnderecamentoCaminhao,
  EtiquetaShipping as Etiqueta
} from './shipping.types';
