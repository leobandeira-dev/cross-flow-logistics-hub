
import { NotaFiscalVolume } from '../../../utils/volumes/types';
import { EmpresaInfo } from '../SolicitacaoTypes';

// Internal form data with some fields optional for initial state
export interface InternalFormData {
  remetente: EmpresaInfo;
  destinatario: EmpresaInfo;
  dataColeta: string;
  horaColeta?: string;
  observacoes: string;
  notasFiscais: NotaFiscalVolume[];
  // Required fields
  tipoFrete: 'FOB' | 'CIF';
  origem: string;
  destino: string;
  // Extended properties for XML import data
  remetenteInfo?: any;
  destinatarioInfo?: any;
  // Extended properties for address display
  origemEndereco?: string;
  origemCEP?: string;
  destinoEndereco?: string;
  destinoCEP?: string;
  // Extended properties for approval flow
  dataAprovacao?: string;
  horaAprovacao?: string;
  dataInclusao?: string;
  horaInclusao?: string;
  // Quantidade de volumes for form submission
  quantidadeVolumes?: number;
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
