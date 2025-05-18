
import { EmpresaInfo, DadosEmpresa, EnderecoCompleto } from "../SolicitacaoTypes";

/**
 * Extrai informações de empresa a partir dos dados XML
 */
export const extractEmpresaInfoFromXML = (empresaInfo: any): EmpresaInfo => {
  // Certifica que o objeto empresaInfo existe
  if (!empresaInfo) return {} as EmpresaInfo;

  // Extrai informações do endereço
  const endereco = empresaInfo.endereco || {};
  
  return {
    razaoSocial: empresaInfo.nome || empresaInfo.razaoSocial || '',
    cnpj: empresaInfo.cnpj || '',
    endereco: endereco.logradouro || '',
    numero: endereco.numero || '',
    complemento: endereco.complemento || '',
    bairro: endereco.bairro || '',
    cidade: endereco.cidade || '',
    uf: endereco.uf || '',
    cep: endereco.cep || '',
    telefone: endereco.fone || empresaInfo.telefone || '',
    email: empresaInfo.email || ''
  };
};

/**
 * Formata o endereço completo a partir de uma empresa
 */
export const formatEnderecoCompleto = (empresa: EmpresaInfo): string => {
  if (!empresa) return '';
  
  const partes = [
    empresa.endereco,
    empresa.numero,
    empresa.complemento ? `- ${empresa.complemento}` : '',
    empresa.bairro ? `- ${empresa.bairro}` : '',
    `${empresa.cidade || ''} - ${empresa.uf || ''}`,
    empresa.cep ? `CEP: ${empresa.cep}` : ''
  ];
  
  return partes.filter(parte => parte).join(' ');
};

/**
 * Formata o CNPJ com máscara
 */
export const formatCNPJ = (cnpj: string): string => {
  if (!cnpj) return '';
  
  // Remove caracteres não numéricos
  const numeros = cnpj.replace(/\D/g, '');
  
  // Aplica a máscara
  if (numeros.length === 14) {
    return numeros.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5'
    );
  }
  
  return cnpj;
};

/**
 * Verifica se o objeto empresa tem informações suficientes
 */
export const hasEmpresaInfo = (empresa: EmpresaInfo): boolean => {
  return !!(empresa && (empresa.razaoSocial || empresa.cnpj));
};

/**
 * Converte DadosEmpresa para EmpresaInfo
 */
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
    telefone: dados.telefone,
    email: dados.email
  };
};

/**
 * Converte EmpresaInfo para DadosEmpresa
 */
export const convertEmpresaInfoToDados = (info: EmpresaInfo): DadosEmpresa => {
  const endereco: EnderecoCompleto = {
    logradouro: info.endereco,
    numero: info.numero,
    complemento: info.complemento,
    bairro: info.bairro,
    cidade: info.cidade,
    uf: info.uf,
    cep: info.cep
  };
  
  return {
    cnpj: info.cnpj,
    razaoSocial: info.razaoSocial,
    nomeFantasia: info.razaoSocial,
    endereco: endereco,
    enderecoFormatado: formatEnderecoCompleto(info),
    telefone: info.telefone,
    email: info.email
  };
};
