
// Tipos de dados para mapeamento com as tabelas do Supabase

// Empresa
export interface Empresa {
  id: string;
  razao_social: string;
  nome_fantasia?: string;
  cnpj: string;
  inscricao_estadual?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  telefone?: string;
  email?: string;
  logo_url?: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

// Usuário
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  avatar_url?: string;
  empresa_id?: string;
  perfil_id?: string;
  status?: string;
  created_at: string;
  updated_at: string;
  
  // Relacionamentos
  empresa?: Empresa;
  perfil?: Perfil;
}

// Perfil (Roles)
export interface Perfil {
  id: string;
  nome: string;
  descricao?: string;
  permissoes: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Motorista
export interface Motorista {
  id: string;
  nome: string;
  cpf: string;
  rg?: string;
  cnh: string;
  categoria_cnh: string;
  validade_cnh: string;
  data_nascimento?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  telefone?: string;
  email?: string;
  foto_url?: string;
  status?: string;
  transportadora_id?: string;
  created_at: string;
  updated_at: string;
  
  // Relacionamentos
  transportadora?: Empresa;
}

// Veículo
export interface Veiculo {
  id: string;
  placa: string;
  tipo: string;
  marca?: string;
  modelo?: string;
  ano?: number;
  capacidade_peso?: number;
  capacidade_volume?: number;
  transportadora_id?: string;
  status?: string;
  created_at: string;
  updated_at: string;
  
  // Relacionamentos
  transportadora?: Empresa;
}

// Nota Fiscal
export interface NotaFiscal {
  id: string;
  numero: string;
  serie?: string;
  chave_acesso?: string;
  valor: number;
  peso_bruto?: number;
  quantidade_volumes?: number;
  data_emissao: string;
  data_entrada?: string;
  data_saida?: string;
  tipo: string;
  status: string;
  empresa_emitente_id?: string;
  empresa_destinatario_id?: string;
  filial_id?: string;
  ordem_carregamento_id?: string;
  coleta_id?: string;
  observacoes?: string;
  tempo_armazenamento_horas?: number;
  created_at: string;
  updated_at: string;
  
  // Relacionamentos
  empresa_emitente?: Empresa;
  empresa_destinatario?: Empresa;
  itens?: ItemNotaFiscal[];
}

// Item da Nota Fiscal
export interface ItemNotaFiscal {
  id: string;
  nota_fiscal_id: string;
  sequencia: number;
  codigo_produto: string;
  descricao: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  created_at: string;
  updated_at: string;
}

// Solicitação de Coleta
export interface SolicitacaoColeta {
  id: string;
  numero_solicitacao: string;
  empresa_solicitante_id?: string;
  tipo_coleta: string;
  data_solicitacao: string;
  data_aprovacao?: string;
  data_coleta?: string;
  status: string;
  endereco_coleta?: string;
  cidade_coleta?: string;
  estado_coleta?: string;
  cep_coleta?: string;
  contato_nome?: string;
  contato_telefone?: string;
  observacoes?: string;
  tempo_aprovacao_coleta_horas?: number;
  created_at: string;
  updated_at: string;
  
  // Relacionamentos
  empresa_solicitante?: Empresa;
}

// Coleta (realizada)
export interface Coleta {
  id: string;
  solicitacao_id?: string;
  numero_coleta: string;
  data_realizada: string;
  motorista_id?: string;
  veiculo_id?: string;
  quantidade_volumes: number;
  peso_total?: number;
  status: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  
  // Relacionamentos
  solicitacao?: SolicitacaoColeta;
  motorista?: Motorista;
  veiculo?: Veiculo;
  notas_fiscais?: NotaFiscal[];
}

// Etiqueta
export interface Etiqueta {
  id: string;
  codigo: string;
  tipo: string;
  data_geracao: string;
  altura?: number;
  largura?: number;
  comprimento?: number;
  peso?: number;
  fragil: boolean;
  nota_fiscal_id?: string;
  etiqueta_mae_id?: string;
  status: string;
  created_at: string;
  updated_at: string;
  
  // Relacionamentos
  nota_fiscal?: NotaFiscal;
  etiqueta_mae?: Etiqueta;
  etiquetas_filhas?: Etiqueta[];
}

// Localização (Endereços no armazém)
export interface Localizacao {
  id: string;
  codigo: string;
  descricao?: string;
  tipo: string;
  filial_id?: string;
  area?: string;
  corredor?: string;
  estante?: string;
  nivel?: string;
  posicao?: string;
  capacidade_peso?: number;
  capacidade_volume?: number;
  ocupado: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

// Movimentação (histórico)
export interface Movimentacao {
  id: string;
  etiqueta_id: string;
  localizacao_origem_id?: string;
  localizacao_destino_id?: string;
  tipo_movimentacao: string;
  data_movimentacao: string;
  usuario_id?: string;
  observacoes?: string;
  created_at: string;
  
  // Relacionamentos
  etiqueta?: Etiqueta;
  localizacao_origem?: Localizacao;
  localizacao_destino?: Localizacao;
  usuario?: Usuario;
}

// Unitização (paletes, containers, etc)
export interface Unitizacao {
  id: string;
  codigo: string;
  tipo_unitizacao: string;
  data_unitizacao: string;
  usuario_id?: string;
  localizacao_id?: string;
  status: string;
  created_at: string;
  updated_at: string;
  
  // Relacionamentos
  usuario?: Usuario;
  localizacao?: Localizacao;
  etiquetas?: Etiqueta[];
}

// Ordem de Carregamento
export interface OrdemCarregamento {
  id: string;
  numero_ordem: string;
  tipo_carregamento: string;
  data_criacao: string;
  data_programada?: string;
  data_inicio?: string;
  data_finalizacao?: string;
  status: string;
  empresa_cliente_id?: string;
  filial_id?: string;
  motorista_id?: string;
  veiculo_id?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  
  // Relacionamentos
  empresa_cliente?: Empresa;
  motorista?: Motorista;
  veiculo?: Veiculo;
  notas_fiscais?: NotaFiscal[];
}

// Carregamento (Carga)
export interface Carregamento {
  id: string;
  ordem_carregamento_id?: string;
  data_inicio_carregamento?: string;
  data_fim_carregamento?: string;
  responsavel_carregamento_id?: string;
  conferente_id?: string;
  quantidade_volumes: number;
  peso_total?: number;
  status: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  
  // Relacionamentos
  ordem_carregamento?: OrdemCarregamento;
  responsavel_carregamento?: Usuario;
  conferente?: Usuario;
}

// Ocorrência
export interface Ocorrencia {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  prioridade: string;
  status: string;
  data_abertura: string;
  data_resolucao?: string;
  empresa_cliente_id?: string;
  nota_fiscal_id?: string;
  coleta_id?: string;
  carregamento_id?: string;
  etiqueta_id?: string;
  usuario_abertura_id?: string;
  usuario_responsavel_id?: string;
  solucao?: string;
  created_at: string;
  updated_at: string;
  
  // Relacionamentos
  empresa_cliente?: Empresa;
  nota_fiscal?: NotaFiscal;
  coleta?: Coleta;
  carregamento?: Carregamento;
  etiqueta?: Etiqueta;
  usuario_abertura?: Usuario;
  usuario_responsavel?: Usuario;
  comentarios?: ComentarioOcorrencia[];
}

// Comentário de Ocorrência
export interface ComentarioOcorrencia {
  id: string;
  ocorrencia_id: string;
  usuario_id?: string;
  comentario: string;
  data_comentario: string;
  created_at: string;
  
  // Relacionamentos
  usuario?: Usuario;
}
