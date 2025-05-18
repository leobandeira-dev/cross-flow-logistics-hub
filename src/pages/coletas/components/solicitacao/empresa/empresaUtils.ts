
import { EnderecoCompleto, DadosEmpresa } from '../../types/coleta.types';
import { converterParaUF } from '@/utils/estadoUtils';

// Formats an address object into a readable string
export const formatarEndereco = (endereco: EnderecoCompleto): string => {
  const parts = [
    endereco.logradouro,
    endereco.numero ? `nº ${endereco.numero}` : '',
    endereco.complemento,
    endereco.bairro ? `${endereco.bairro},` : '',
    `${endereco.cidade}/${converterParaUF(endereco.uf)}`,
    endereco.cep ? `CEP: ${endereco.cep.replace(/^(\d{5})(\d{3})$/, '$1-$2')}` : ''
  ].filter(Boolean);
  
  return parts.join(' ');
};

// Processes UF input, converting to uppercase and limiting to 2 characters
export const processUFValue = (value: string): string => {
  return converterParaUF(value.toUpperCase()).substring(0, 2);
};
