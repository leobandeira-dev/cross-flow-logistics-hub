
import { ChangeEvent } from 'react';

export interface SolicitacaoFormHeaderProps {
  cliente?: string;
  dataColeta?: string;
  horaColeta?: string;
  dataAprovacao?: string;
  horaAprovacao?: string;
  dataInclusao?: string;
  horaInclusao?: string;
  origem?: string;
  origemEndereco?: string;
  origemCEP?: string;
  destino?: string;
  destinoEndereco?: string;
  destinoCEP?: string;
  onClienteChange?: (value: string) => void;
  onDataColetaChange?: (value: string) => void;
  onHoraColetaChange?: (value: string) => void;
  onOrigemChange?: (value: string) => void;
  onDestinoChange?: (value: string) => void;
  readOnlyAddresses?: boolean;
  currentStep?: number;
  isLoading?: boolean;
}

export interface AddressSectionProps {
  label: string;
  cidade: string;
  uf: string;
  endereco: string;
  cep: string;
  readOnly: boolean;
  onCidadeChange?: (value: string) => void;
  onUFChange?: (value: string) => void;
  id: string;
}

export interface DateSectionProps {
  dataLabel: string;
  horaLabel: string;
  data: string;
  hora: string;
  readonly?: boolean;
  onDataChange?: (value: string) => void;
  onHoraChange?: (value: string) => void;
  id: string;
}
