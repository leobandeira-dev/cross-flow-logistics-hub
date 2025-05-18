
import { ReactNode } from 'react';
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
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  telefone?: string;
  email?: string;
}

// Adding missing types
export interface EnderecoCompleto {
  logradouro: string;
  numero: string;
  complemento?: string;
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
  telefone?: string;
  email?: string;
}

export interface SolicitacaoFormData {
  remetente: EmpresaInfo;
  destinatario: EmpresaInfo;
  tipoFrete: 'FOB' | 'CIF';
  dataColeta: string;
  horaColeta: string;
  observacoes: string;
  notasFiscais: NotaFiscalVolume[];
  origem: string;
  destino: string;
  quantidadeVolumes?: number;
}

export interface HeaderSectionProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export interface TabContentProps {
  onNext?: () => void;
  onImportSuccess?: (notasFiscais: NotaFiscalVolume[], remetenteInfo?: any, destinatarioInfo?: any) => void;
  isLoading?: boolean;
}

export interface FormStepProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export interface FormHeaderProps {
  currentStep: number;
  tipoFrete: string;
  dataColeta: string;
  horaColeta: string;
  dataAprovacao?: string;
  horaAprovacao?: string;
  dataInclusao?: string;
  horaInclusao?: string;
  isLoading: boolean;
  onTipoFreteChange: (value: string) => void;
  onDataColetaChange: (value: string) => void;
  onHoraColetaChange: (value: string | null) => void;
}

export interface SolicitacaoFooterProps {
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export interface SolicitacaoProgressProps {
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
}
