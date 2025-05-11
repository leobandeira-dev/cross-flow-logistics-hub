
export type PerfilEmpresa = 
  | 'transportadora'     // Transport company - System manager
  | 'filial'             // Branch of transport company
  | 'cliente_direto'     // Direct client
  | 'cliente_indireto';  // Indirect client (supplier to direct clients)

export interface EmpresaBase {
  id: string;
  cnpj: string;          // Primary identifier for companies
  razao_social: string;
  nome_fantasia: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  ativo: boolean;
  data_cadastro: string;
  transportadora_principal_id?: string; // ID of the main transport company (if applicable)
}

export interface Empresa extends EmpresaBase {
  perfis: PerfilEmpresa[];
}

// Interface for module permissions similar to user permissions
export interface ModuloEmpresa {
  id: string;
  nome: string;
  tabelas: TabEmpresa[];
}

export interface TabEmpresa {
  id: string;
  nome: string;
  rotinas: RotinaEmpresa[];
}

export interface RotinaEmpresa {
  id: string;
  nome: string;
}

export interface PermissoesEmpresa {
  empresa_id: string;
  permissoes: Record<string, boolean>; // Keys in format: module_moduleId, tab_moduleId_tabId, routine_moduleId_tabId_rotineId
}

// Document relationships
export interface RelacionamentoDocumento {
  documento_id: string;
  tipo_documento: string; // 'nota_fiscal', 'conhecimento', etc.
  remetente_cnpj: string;
  destinatario_cnpj: string;
  transportador_cnpj: string;
}
