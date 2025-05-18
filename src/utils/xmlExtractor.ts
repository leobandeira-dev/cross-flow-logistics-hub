
/**
 * Utilitário para extrair informações de documentos XML baseado em caminhos específicos
 */

// Função para extrair valores específicos de um XML baseado em um caminho de acesso
export const extractValueFromXml = (xmlObj: any, path: string): string => {
  try {
    const parts = path.split(':');
    let current = xmlObj;
    
    for (const part of parts) {
      if (!current || typeof current !== 'object') {
        return '';
      }
      
      // Tenta acessar o campo com letra minúscula primeiro (padrão comum)
      if (current[part.toLowerCase()]) {
        current = current[part.toLowerCase()];
      } 
      // Tenta acessar com a chave exata
      else if (current[part]) {
        current = current[part];
      } 
      // Tenta acessar com a primeira letra em minúscula (outro padrão comum)
      else if (part.length > 0 && current[part.charAt(0).toLowerCase() + part.slice(1)]) {
        current = current[part.charAt(0).toLowerCase() + part.slice(1)];
      } 
      // Tenta acessar com todas as letras em maiúscula
      else if (current[part.toUpperCase()]) {
        current = current[part.toUpperCase()];
      }
      // Tenta acessar removendo o primeiro caractere (caso seja um prefixo)
      else if (part.length > 1 && current[part.slice(1)]) {
        current = current[part.slice(1)];
      }
      else {
        // Último recurso: procura por qualquer chave que contenha a parte
        const matchingKey = Object.keys(current).find(key => 
          key.toLowerCase().includes(part.toLowerCase())
        );
        if (matchingKey) {
          current = current[matchingKey];
        } else {
          // Se não conseguiu encontrar, retorna vazio
          return '';
        }
      }
    }
    
    // Retorna o valor como string
    return current ? current.toString() : '';
  } catch (error) {
    console.error(`Erro ao extrair valor do caminho ${path}:`, error);
    return '';
  }
};

// Extrai campos específicos de nota fiscal baseado nos caminhos definidos
export const extractNotaFiscalData = (xmlObj: any): Record<string, any> => {
  if (!xmlObj) return {};
  
  console.log("Estrutura encontrada:", xmlObj);
  
  // Tenta acessar o objeto NFe, que pode estar em diferentes níveis
  const nfeObj = xmlObj.NFe || 
                 (xmlObj.nfeProc && xmlObj.nfeProc.NFe) || 
                 (xmlObj.nfeProc && xmlObj.nfeProc.nfe) || 
                 xmlObj;
  
  // Caminhos para extrair campos da nota fiscal
  const paths = {
    // Dados da Nota Fiscal
    chaveNF: "nfeProc:protNFe:infProt:chNFe",
    dataHoraEmissao: "NFe:infNFe:ide:dhEmi",
    numeroNF: "NFe:infNFe:ide:nNF",
    serieNF: "NFe:infNFe:ide:serie",
    tipoOperacao: "NFe:infNFe:ide:tpNF",
    
    // Dados do Emitente
    emitenteCNPJ: "NFe:infNFe:emit:CNPJ",
    emitenteRazaoSocial: "NFe:infNFe:emit:xNome",
    emitenteTelefone: "NFe:infNFe:emit:enderEmit:fone",
    emitenteUF: "NFe:infNFe:emit:enderEmit:UF",
    emitenteCidade: "NFe:infNFe:emit:enderEmit:xMun",
    emitenteBairro: "NFe:infNFe:emit:enderEmit:xBairro",
    emitenteEndereco: "NFe:infNFe:emit:enderEmit:xLgr",
    emitenteNumero: "NFe:infNFe:emit:enderEmit:nro",
    emitenteCEP: "NFe:infNFe:emit:enderEmit:CEP",
    emitenteComplemento: "NFe:infNFe:emit:enderEmit:xCpl",
    
    // Dados do Destinatário
    destinatarioCNPJ: "NFe:infNFe:dest:CNPJ",
    destinatarioRazaoSocial: "NFe:infNFe:dest:xNome",
    destinatarioTelefone: "NFe:infNFe:dest:enderDest:fone",
    destinatarioUF: "NFe:infNFe:dest:enderDest:UF",
    destinatarioCidade: "NFe:infNFe:dest:enderDest:xMun",
    destinatarioBairro: "NFe:infNFe:dest:enderDest:xBairro",
    destinatarioEndereco: "NFe:infNFe:dest:enderDest:xLgr",
    destinatarioNumero: "NFe:infNFe:dest:enderDest:nro",
    destinatarioCEP: "NFe:infNFe:dest:enderDest:CEP",
    destinatarioComplemento: "NFe:infNFe:dest:enderDest:xCpl",
    
    // Totais da Nota
    valorTotal: "NFe:infNFe:total:ICMSTot:vNF",
    pesoTotalBruto: "NFe:infNFe:transp:vol:pesoB",
    volumesTotal: "NFe:infNFe:transp:vol:qVol",
    informacoesComplementares: "NFe:infNFe:infAdic:infCpl"
  };
  
  // Extrai cada valor baseado nos caminhos
  const result: Record<string, any> = {};
  
  // Função que extrai usando diferentes estratégias de acesso para lidar com variações na estrutura XML
  const extractWithMultipleAttempts = (key: string, path: string) => {
    // Tenta extrair usando o caminho completo
    let value = extractValueFromXml(xmlObj, path);
    
    // Se não encontrou, tenta sem o prefixo NFe:
    if (!value && path.startsWith('NFe:')) {
      value = extractValueFromXml(xmlObj, path.replace('NFe:', ''));
    }
    
    // Tenta com o objeto NFe se disponível
    if (!value && nfeObj) {
      value = extractValueFromXml(nfeObj, path.replace('NFe:', ''));
    }
    
    // Tenta navegar manualmente pela estrutura para campos essenciais
    if (!value) {
      if (key === 'numeroNF') {
        // Tentativas específicas para número da NF
        value = extractValueFromXml(xmlObj, 'ide:nNF') || 
                extractValueFromXml(xmlObj, 'nNF') ||
                extractValueFromXml(nfeObj, 'infNFe:ide:nNF') ||
                extractValueFromXml(xmlObj, 'infNFe:ide:nNF');
      } else if (key === 'emitenteRazaoSocial') {
        value = extractValueFromXml(xmlObj, 'emit:xNome') ||
                extractValueFromXml(xmlObj, 'xNome') ||
                extractValueFromXml(nfeObj, 'infNFe:emit:xNome');
      }
    }
    
    return value;
  };
  
  // Extrair cada valor
  for (const [key, path] of Object.entries(paths)) {
    result[key] = extractWithMultipleAttempts(key, path);
  }

  // Format and combine address fields
  result.enderecoRemetenteCompleto = `${result.emitenteEndereco || ''}, ${result.emitenteNumero || ''} ${result.emitenteComplemento ? '- ' + result.emitenteComplemento : ''}`;
  result.enderecoDestinatarioCompleto = `${result.destinatarioEndereco || ''}, ${result.destinatarioNumero || ''} ${result.destinatarioComplemento ? '- ' + result.destinatarioComplemento : ''}`;
  
  // Tenta extrair o número do pedido das informações complementares usando regex
  if (result.informacoesComplementares) {
    console.log("Informações complementares extraídas:", result.informacoesComplementares);
    const pedidoRegex = /pedido[:\s]*(\d+[-]?\d*)/i;
    const pedidoMatch = result.informacoesComplementares.match(pedidoRegex);
    result.numeroPedido = pedidoMatch ? pedidoMatch[1] : '';
    
    // Também procura em uma segunda linha de texto para o número do pedido
    const numeroPedidoRegex = /\b(\d{7,}[-]?\d{1,3})\b/i;
    const secondMatch = result.informacoesComplementares.match(numeroPedidoRegex);
    if (!result.numeroPedido && secondMatch) {
      result.numeroPedido = secondMatch[1];
    }
    
    console.log("Número do pedido extraído dos produtos:", result.numeroPedido);
  }
  
  // Log da data de emissão processada
  if (result.dataHoraEmissao) {
    const processedDate = result.dataHoraEmissao.split('T').join('T');
    console.log("Data de emissão processada:", processedDate);
  }
  
  // Log dos volumes totais
  if (result.volumesTotal) {
    console.log("Volumes totais extraídos:", result.volumesTotal);
  }
  
  return result;
};
