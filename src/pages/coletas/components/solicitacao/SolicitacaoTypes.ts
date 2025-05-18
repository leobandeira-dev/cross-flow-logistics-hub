
import { NotaFiscalVolume } from '../../utils/volumes/types';

export interface SolicitacaoDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export interface NovaSolicitacaoDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export interface EmpresaInfo {
  razaoSocial: string;
  cnpj: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  telefone: string;
  email: string;
}

export interface EnderecoCompleto {
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}

export interface DadosEmpresa {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  endereco: EnderecoCompleto;
  enderecoFormatado: string;
}

export interface SolicitacaoFormData {
  remetente: EmpresaInfo;
  destinatario: EmpresaInfo;
  dataColeta: string;
  horaColeta?: string;
  observacoes: string;
  notasFiscais: NotaFiscalVolume[];
  cliente: string;
  origem: string;
  origemEndereco?: string;
  origemCEP?: string;
  destino: string;
  destinoEndereco?: string;
  destinoCEP?: string;
  dataAprovacao?: string;
  horaAprovacao?: string;
  dataInclusao?: string;
  horaInclusao?: string;
  quantidadeVolumes?: number;
}

export const EMPTY_EMPRESA: EmpresaInfo = {
  razaoSocial: '',
  cnpj: '',
  endereco: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
  cep: '',
  telefone: '',
  email: ''
};

export const EMPTY_ENDERECO: EnderecoCompleto = {
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
  cep: ''
};
