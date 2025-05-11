
import { NotaFiscalVolume } from "../../utils/volumeCalculations";

export interface SolicitacaoFormData {
  cliente: string;
  origem: string;
  destino: string;
  dataColeta: string;
  observacoes: string;
  notasFiscais: NotaFiscalVolume[];
  transportadora_cnpj?: string; // CNPJ of the transport company
  remetente_cnpj?: string;     // CNPJ of the sender
  destinatario_cnpj?: string;  // CNPJ of the recipient
}

export interface SolicitacaoDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
