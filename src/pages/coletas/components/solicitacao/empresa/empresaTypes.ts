
import { EnderecoCompleto, DadosEmpresa } from '../../types/coleta.types';

export const EMPTY_ENDERECO: EnderecoCompleto = {
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
  cep: ''
};

export const EMPTY_EMPRESA: DadosEmpresa = {
  cnpj: '',
  razaoSocial: '',
  nomeFantasia: '',
  endereco: EMPTY_ENDERECO,
  enderecoFormatado: ''
};

export interface EmpresaInfoFormProps {
  tipo: 'remetente' | 'destinatario';
  dados?: DadosEmpresa;
  onDadosChange?: (dados: DadosEmpresa) => void;
  readOnly?: boolean;
  empresa?: DadosEmpresa; // For backward compatibility
  onChange?: (empresa: DadosEmpresa) => void; // For backward compatibility
  label?: string;
}

export interface EnderecoFormProps {
  endereco: EnderecoCompleto;
  readOnly: boolean;
  tipo: string;
  onEnderecoChange: (field: keyof EnderecoCompleto, value: string) => void;
}
