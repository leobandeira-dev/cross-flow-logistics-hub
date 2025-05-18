
export interface SolicitacaoFormHeaderProps {
  currentStep?: number;
  isLoading?: boolean;
  // Cliente information
  cliente?: string;
  // Collection date and time
  dataColeta?: string; 
  horaColeta?: string;
  // Approval date and time
  dataAprovacao?: string;
  horaAprovacao?: string;
  // Inclusion date and time
  dataInclusao?: string;
  horaInclusao?: string;
  // Origin information
  origem?: string;
  origemEndereco?: string;
  origemCEP?: string;
  // Destination information
  destino?: string;
  destinoEndereco?: string;
  destinoCEP?: string;
  // Event handlers
  onClienteChange?: (cliente: string) => void;
  onDataColetaChange?: (data: string) => void;
  onHoraColetaChange?: (hora: string) => void;
  onOrigemChange?: (origem: string) => void;
  onDestinoChange?: (destino: string) => void;
  // Additional props
  readOnlyAddresses?: boolean;
}
