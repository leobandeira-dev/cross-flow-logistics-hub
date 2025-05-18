
/**
 * Funções para conversão e formatação de estados brasileiros
 */

// Mapeamento de nomes de estados para siglas
const estadosMap: Record<string, string> = {
  'acre': 'AC',
  'alagoas': 'AL',
  'amapa': 'AP',
  'amazonas': 'AM',
  'bahia': 'BA',
  'ceara': 'CE',
  'distrito federal': 'DF',
  'espirito santo': 'ES',
  'goias': 'GO',
  'maranhao': 'MA',
  'mato grosso': 'MT',
  'mato grosso do sul': 'MS',
  'minas gerais': 'MG',
  'para': 'PA',
  'paraiba': 'PB',
  'parana': 'PR',
  'pernambuco': 'PE',
  'piaui': 'PI',
  'rio de janeiro': 'RJ',
  'rio grande do norte': 'RN',
  'rio grande do sul': 'RS',
  'rondonia': 'RO',
  'roraima': 'RR',
  'santa catarina': 'SC',
  'sao paulo': 'SP',
  'sergipe': 'SE',
  'tocantins': 'TO'
};

/**
 * Converte o nome de um estado para sua sigla
 * Se a entrada já for uma sigla ou não for encontrada, retorna a própria entrada
 * 
 * @param estado - Nome do estado ou já a sigla
 * @returns Sigla do estado (UF)
 */
export const converterParaUF = (estado?: string): string => {
  if (!estado) return '';
  
  // Se já for uma sigla (2 caracteres), retorna a própria entrada
  if (estado.length === 2 && estado === estado.toUpperCase()) {
    return estado;
  }
  
  // Normaliza a string (remove acentos, converte para minúsculo)
  const normalizado = estado.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  
  // Retorna a sigla ou a própria entrada se não encontrado
  return estadosMap[normalizado] || estado;
};

/**
 * Verifica se uma string é uma UF válida
 * 
 * @param uf - String a ser verificada
 * @returns boolean indicando se é uma UF válida
 */
export const isUFValida = (uf?: string): boolean => {
  if (!uf || uf.length !== 2) return false;
  return Object.values(estadosMap).includes(uf.toUpperCase());
};
