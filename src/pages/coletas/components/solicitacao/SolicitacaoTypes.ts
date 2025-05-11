
import { NotaFiscalVolume } from "../../utils/volumeCalculations";

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
  cpf?: string;
  razaoSocial: string;
  nomeFantasia: string;
  endereco: EnderecoCompleto;
  enderecoFormatado: string;
}

export interface SolicitacaoFormData {
  remetente: DadosEmpresa;
  destinatario: DadosEmpresa;
  dataColeta: string;
  observacoes: string;
  notasFiscais: NotaFiscalVolume[];
  remetenteInfo?: any;         // Full sender information from XML
  destinatarioInfo?: any;      // Full recipient information from XML
}

export interface SolicitacaoDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
