
export interface Empresa {
  id?: number;
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj: string;
  inscricaoEstadual?: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  telefone: string;
  email: string;
  contato?: string;
  perfil: string;
  transportadoraPrincipal?: boolean;
  status?: string;
}

// Atualizado para refletir os perfis atualizados
export type PerfilEmpresa = 'Transportadora' | 'Filial' | 'Cliente' | 'Fornecedor';

export interface ModuloEmpresa {
  id: string;
  nome: string;
  tabelas: TabelaEmpresa[];
}

export interface TabelaEmpresa {
  id: string;
  nome: string;
  rotinas: RotinaEmpresa[];
}

export interface RotinaEmpresa {
  id: string;
  nome: string;
}

// Novo: Interface para perfis customizados
export interface PerfilCustomizado {
  id: string;
  nome: string;
  descricao?: string;
  tipo: 'usuario' | 'empresa';
  permissoes?: Record<string, boolean>;
}
