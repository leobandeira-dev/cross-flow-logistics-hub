
import { SolicitacaoFormData, EmpresaInfo } from '../SolicitacaoTypes';
import { NotaFiscalVolume } from '../../../utils/volumes/types';

// Internal form data with some fields optional for initial state
export interface InternalFormData extends Partial<SolicitacaoFormData> {
  remetente: EmpresaInfo;
  destinatario: EmpresaInfo;
  dataColeta: string;
  observacoes: string;
  notasFiscais: NotaFiscalVolume[];
  // These are required in SolicitacaoFormData but can be empty initially
  cliente: string;
  origem: string;
  destino: string;
  // Additional properties for handling XML import data
  remetenteInfo?: any;
  destinatarioInfo?: any;
}

// Return type for the useSolicitacaoForm hook
export interface UseSolicitacaoFormReturn {
  isLoading: boolean;
  isImporting: boolean;
  currentStep: number;
  formData: InternalFormData;
  handleInputChange: <K extends keyof InternalFormData>(field: K, value: InternalFormData[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
  handleSubmit: () => void;
  handleImportSuccess: (notasFiscais: NotaFiscalVolume[], remetenteInfo?: any, destinatarioInfo?: any) => void;
}
