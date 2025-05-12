
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
  cliente?: string;            // Backwards compatibility
  origem?: string;             // Backwards compatibility
  destino?: string;            // Backwards compatibility
}

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

export interface SolicitacaoFormHeaderProps {
  cliente?: string;
  dataColeta?: string;
  origem?: string;
  destino?: string;
  onClienteChange?: (value: string) => void;
  onDataColetaChange?: (value: string) => void;
  onOrigemChange?: (value: string) => void;
  onDestinoChange?: (value: string) => void;
  readOnlyAddresses?: boolean;
  currentStep?: number;
  isLoading?: boolean;
}

export interface ConfirmationStepProps {
  formData: SolicitacaoFormData;
  onChangeObservacoes?: (value: string) => void;
  handleInputChange?: <K extends keyof SolicitacaoFormData>(field: K, value: SolicitacaoFormData[K]) => void;
}

export interface SolicitacaoFooterProps {
  currentStep: number;
  isLoading: boolean;
  onPrevStep?: () => void;
  onNextStep?: () => void;
  onSubmit: () => void;
  onClose?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export interface EmpresaInfoFormProps {
  tipo: 'remetente' | 'destinatario';
  dados: DadosEmpresa;
  onDadosChange: (dados: DadosEmpresa) => void;
  readOnly?: boolean;
  empresa?: DadosEmpresa;
  onChange?: (dados: DadosEmpresa) => void;
  label?: string;
}
