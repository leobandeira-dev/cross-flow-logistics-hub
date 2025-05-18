
export interface SolicitacaoFormHeaderProps {
  currentStep?: number;
  isLoading?: boolean;
  // Frete type (FOB/CIF)
  tipoFrete?: 'FOB' | 'CIF';
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
  // Companies information
  remetente?: {
    razaoSocial: string;
    cnpj: string;
  };
  destinatario?: {
    razaoSocial: string;
    cnpj: string;
  };
  // Event handlers
  onTipoFreteChange?: (tipo: 'FOB' | 'CIF') => void;
  onDataColetaChange?: (data: string) => void;
  onHoraColetaChange?: (hora: string) => void;
  onOrigemChange?: (origem: string) => void;
  onDestinoChange?: (destino: string) => void;
  // Additional props
  readOnlyAddresses?: boolean;
}

// Add missing AddressSectionProps
export interface AddressSectionProps {
  label: string;
  cidade: string;
  uf: string;
  endereco: string;
  cep: string;
  readOnly?: boolean;
  onCidadeChange?: (value: string) => void;
  onUFChange?: (value: string) => void;
  id: string;
}

// Add missing DateSectionProps
export interface DateSectionProps {
  dataLabel: string;
  horaLabel: string;
  data: string;
  hora: string;
  readonly?: boolean;
  onDataChange?: (data: string) => void;
  onHoraChange?: (hora: string) => void;
  id: string;
}
