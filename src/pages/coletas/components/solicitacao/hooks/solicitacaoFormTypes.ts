
import { NotaFiscalVolume } from '../../../utils/volumeCalculations';
import { SolicitacaoFormData } from '../SolicitacaoTypes';

export interface InternalFormData extends SolicitacaoFormData {
  cliente?: string;
  origem?: string;
  destino?: string;
  [key: string]: any;
}

export interface UseSolicitacaoFormReturn {
  isLoading: boolean;
  isImporting: boolean;
  currentStep: number;
  formData: InternalFormData;
  handleInputChange: <K extends keyof InternalFormData>(field: K, value: InternalFormData[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
  handleSubmit: () => void;
  handleImportSuccess: (notasFiscais: NotaFiscalVolume[] | any[], remetenteInfo?: any, destinatarioInfo?: any) => void;
}
