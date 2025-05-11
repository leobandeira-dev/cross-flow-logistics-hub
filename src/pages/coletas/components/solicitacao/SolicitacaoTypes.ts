
import { NotaFiscalVolume } from "../../utils/volumeCalculations";

export interface SolicitacaoFormData {
  cliente: string;
  origem: string;
  destino: string;
  dataColeta: string;
  observacoes: string;
  notasFiscais: NotaFiscalVolume[];
}

export interface SolicitacaoDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
