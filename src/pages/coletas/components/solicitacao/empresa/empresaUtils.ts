
import { EnderecoCompleto, DadosEmpresa, EmpresaInfo } from '../SolicitacaoTypes';

// Convert DadosEmpresa to EmpresaInfo
export const convertDadosToEmpresaInfo = (dados: DadosEmpresa): EmpresaInfo => {
  return {
    razaoSocial: dados.razaoSocial,
    cnpj: dados.cnpj,
    endereco: dados.endereco.logradouro,
    numero: dados.endereco.numero,
    complemento: dados.endereco.complemento,
    bairro: dados.endereco.bairro,
    cidade: dados.endereco.cidade,
    uf: dados.endereco.uf,
    cep: dados.endereco.cep,
    telefone: dados.telefone || '', // Add telefone if available
    email: dados.email || '' // Add email if available
  };
};

// Convert EmpresaInfo to DadosEmpresa
export const convertEmpresaInfoToDados = (info: EmpresaInfo): DadosEmpresa => {
  return {
    razaoSocial: info.razaoSocial,
    cnpj: info.cnpj,
    nomeFantasia: '',  // Not available in EmpresaInfo
    telefone: info.telefone || '',
    email: info.email || '',
    endereco: {
      logradouro: info.endereco,
      numero: info.numero,
      complemento: info.complemento || '',
      bairro: info.bairro,
      cidade: info.cidade,
      uf: info.uf,
      cep: info.cep
    },
    enderecoFormatado: formatEnderecoDisplay({
      logradouro: info.endereco,
      numero: info.numero,
      complemento: info.complemento || '',
      bairro: info.bairro,
      cidade: info.cidade,
      uf: info.uf,
      cep: info.cep
    })
  };
};

// Format address for display
export const formatEnderecoDisplay = (endereco: EnderecoCompleto): string => {
  return `${endereco.logradouro}, ${endereco.numero}${endereco.complemento ? ` - ${endereco.complemento}` : ''}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.uf}, ${endereco.cep}`;
};

// Extract address data from XML data
export const extractAddressFromXml = (xmlData: any, type: 'emitente' | 'destinatario') => {
  const prefix = type === 'emitente' ? 'emitente' : 'destinatario';
  
  const endereco: EnderecoCompleto = {
    logradouro: xmlData[`${prefix}Endereco`] || '',
    numero: xmlData[`${prefix}Numero`] || '',
    complemento: xmlData[`${prefix}Complemento`] || '',
    bairro: xmlData[`${prefix}Bairro`] || '',
    cidade: xmlData[`${prefix}Cidade`] || '',
    uf: xmlData[`${prefix}UF`] || '',
    cep: xmlData[`${prefix}CEP`] || ''
  };
  
  const dadosEmpresa: DadosEmpresa = {
    razaoSocial: xmlData[`${prefix}RazaoSocial`] || '',
    cnpj: xmlData[`${prefix}CNPJ`] || '',
    nomeFantasia: '',  // Not typically available in XML
    telefone: xmlData[`${prefix}Telefone`] || '',
    email: '',  // Not typically available in XML
    endereco: endereco,
    enderecoFormatado: formatEnderecoDisplay(endereco)
  };
  
  return dadosEmpresa;
};
