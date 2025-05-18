
import { NotaFiscalVolume } from '../../utils/volumes/types';

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

export interface EmpresaInfoFormProps {
  tipo: 'remetente' | 'destinatario';
  dados?: DadosEmpresa;
  onDadosChange?: (dados: DadosEmpresa) => void;
  readOnly?: boolean;
  empresa?: DadosEmpresa; // For backward compatibility
  onChange?: (empresa: DadosEmpresa) => void; // For backward compatibility
  label?: string;
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

export interface SolicitacaoFormData {
  remetente: EmpresaInfo;
  destinatario: EmpresaInfo;
  dataColeta: string;
  horaColeta?: string;
  dataAprovacao?: string;
  horaAprovacao?: string;
  dataInclusao?: string;
  horaInclusao?: string;
  observacoes: string;
  notasFiscais: NotaFiscalVolume[];
  cliente: string;
  origem: string;
  origemEndereco?: string;
  origemCEP?: string;
  destino: string;
  destinoEndereco?: string;
  destinoCEP?: string;
  valorTotal?: number;
  pesoTotal?: number;
  volumeTotal?: number;
  quantidadeVolumes?: number;
}

export interface SolicitacaoFormHeaderProps {
  cliente: string;
  dataColeta: string;
  horaColeta?: string;
  dataAprovacao?: string;
  horaAprovacao?: string;
  dataInclusao?: string;
  horaInclusao?: string;
  origem: string;
  origemEndereco?: string;
  origemCEP?: string;
  destino: string;
  destinoEndereco?: string;
  destinoCEP?: string;
  onClienteChange: (cliente: string) => void;
  onDataColetaChange: (data: string) => void;
  onHoraColetaChange?: (hora: string) => void;
  onOrigemChange: (origem: string) => void;
  onDestinoChange: (destino: string) => void;
  readOnlyAddresses?: boolean;
  currentStep?: number;
  isLoading?: boolean;
}

export interface NovaSolicitacaoDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export interface SolicitacaoDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export interface SolicitacaoFormProps {
  formData: SolicitacaoFormData;
  handleInputChange: <K extends keyof SolicitacaoFormData>(field: K, value: SolicitacaoFormData[K]) => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  isLoading?: boolean;
  handleSingleXmlUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBatchXmlUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleExcelUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDownloadTemplate?: () => void;
}

export interface SolicitacaoProgressProps {
  currentStep: number;
  onNext?: () => void;
  onPrev?: () => void;
}

export interface SolicitacaoFooterProps {
  currentStep: number;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
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
