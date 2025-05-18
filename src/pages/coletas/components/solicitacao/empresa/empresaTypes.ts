
import { EnderecoCompleto, DadosEmpresa } from '../SolicitacaoTypes';

// Using types from SolicitacaoTypes.ts
export { EnderecoCompleto, DadosEmpresa };

// Empty empresa data objects
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
