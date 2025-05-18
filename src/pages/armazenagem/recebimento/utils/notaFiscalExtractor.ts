import { NotaFiscalSchemaType } from '../components/forms/notaFiscalSchema';

/**
 * Extrai dados da nota fiscal a partir de um XML
 * @param xmlObj Objeto XML parseado
 * @returns Objeto com os dados extraídos
 */
export const extractDataFromXml = (xmlObj: any): Record<string, any> => {
  try {
    console.log("Tentando extrair dados do XML:", xmlObj);
    
    // Navigate through the XML structure using the new approach
    const nfeProc = xmlObj.nfeproc || xmlObj.nfeProc || {};
    
    // Accessing the XML content in a more resilient way
    const nfe = nfeProc.nfe || nfeProc.NFe;
    const infNFe = nfe?.infnfe || nfe?.infNFe || nfe?.infNFe;
    
    if (!infNFe) {
      console.error("Estrutura de XML não reconhecida:", xmlObj);
      return {};
    }
    
    // Extracting basic data
    const ide = infNFe.ide || {};
    const emit = infNFe.emit || {};
    const dest = infNFe.dest || {};
    const transp = infNFe.transp || {};
    const total = infNFe.total || {};
    const infAdic = infNFe.infadic || infNFe.infAdic || {};
    
    console.log("Estrutura encontrada:", {
      ide: ide,
      emit: emit,
      dest: dest,
      transp: transp,
      total: total,
      infAdic: infAdic
    });
    
    // Helper function to safely extract a value
    const getValue = (obj: any, path: string[], defaultValue: string = ''): string => {
      let current = obj;
      
      for (const key of path) {
        if (current && typeof current === 'object' && key in current) {
          current = current[key];
        } else {
          return defaultValue;
        }
      }
      
      return current?.toString() || defaultValue;
    };

    // Extract order number from product details
    const extractOrderNumberFromProducts = (infNFe: any): string => {
      try {
        // Access the product information
        const det = infNFe.det;
        
        // If det is an array, look through each product
        if (Array.isArray(det)) {
          for (const item of det) {
            if (item.prod && item.prod.xped) {
              // Found the order number, remove any hyphens
              return item.prod.xped.toString().replace(/-/g, '');
            }
          }
        } 
        // If det is a single object
        else if (det && det.prod && det.prod.xped) {
          return det.prod.xped.toString().replace(/-/g, '');
        }
        
        // Try to extract from additional information if not found in products
        if (infAdic && infAdic.infcpl || infAdic.infCpl) {
          const infCpl = infAdic.infcpl || infAdic.infCpl;
          const pedidoRegex = /pedido[:\s]*(\d+[-]?\d*)/i;
          const match = infCpl.match(pedidoRegex);
          if (match && match[1]) {
            return match[1].toString();
          }
        }
        
        return '';
      } catch (error) {
        console.error("Erro ao extrair número de pedido dos produtos:", error);
        return '';
      }
    };

    // Helper function to split address and number
    const splitAddressAndNumber = (fullAddress: string): { address: string, number: string } => {
      // Common patterns for addresses with numbers
      const numberPattern = /,\s*n[º°]?\s*(\d+\w*)/i;
      const commaPattern = /(.*),\s*(\d+\w*)/;
      
      let match = fullAddress.match(numberPattern) || fullAddress.match(commaPattern);
      
      if (match) {
        return {
          address: match[1].trim(),
          number: match[2] || ''
        };
      }
      
      // If no match, try splitting by comma
      const parts = fullAddress.split(',');
      if (parts.length > 1) {
        const potentialNumber = parts[1].trim();
        if (/^\d+\w*$/.test(potentialNumber)) {
          return {
            address: parts[0].trim(),
            number: potentialNumber
          };
        }
      }
      
      // Default: return original address and empty number
      return {
        address: fullAddress,
        number: ''
      };
    };

    // Get chave from the right location
    let chaveNF = '';
    if (nfeProc.protNFe && nfeProc.protNFe.infProt && nfeProc.protNFe.infProt.chNFe) {
      chaveNF = nfeProc.protNFe.infProt.chNFe;
    } else if (infNFe.Id) {
      // Sometimes the ID contains the key in format "NFe35230698765432109876550010000067891000067890"
      const idMatch = infNFe.Id.toString().match(/NFe(\d+)/i);
      if (idMatch && idMatch[1]) {
        chaveNF = idMatch[1];
      }
    }

    // Extract order number from product details
    const orderNumber = extractOrderNumberFromProducts(infNFe);
    console.log("Número do pedido extraído dos produtos:", orderNumber);
    
    // Process emission date and time
    let emissionDate = '';
    const dhEmi = getValue(ide, ['dhemi']) || getValue(ide, ['dhEmi']);
    const dEmi = getValue(ide, ['demi']) || getValue(ide, ['dEmi']);
    const hEmi = getValue(ide, ['hemi']) || getValue(ide, ['hEmi']);
    
    if (dhEmi) {
      // If we have a complete date+time string
      try {
        emissionDate = new Date(dhEmi).toISOString().slice(0, 16);
      } catch (e) {
        console.log("Erro ao converter data/hora de emissão:", e);
      }
    } else if (dEmi) {
      // If date and time are separate fields
      try {
        const dateStr = dEmi + (hEmi ? `T${hEmi}` : 'T00:00');
        emissionDate = new Date(dateStr).toISOString().slice(0, 16);
      } catch (e) {
        console.log("Erro ao converter data/hora de emissão separados:", e);
      }
    }
    
    console.log("Data de emissão processada:", emissionDate);
    
    // Process sender address
    const emitentEndereco = getValue(emit, ['enderemit', 'xlgr']) || getValue(emit, ['enderEmit', 'xLgr']);
    const emitenteNumero = getValue(emit, ['enderemit', 'nro']) || getValue(emit, ['enderEmit', 'nro']);
    
    // Process recipient address
    const destinatarioEndereco = getValue(dest, ['enderdest', 'xlgr']) || getValue(dest, ['enderDest', 'xLgr']);
    const destinatarioNumero = getValue(dest, ['enderdest', 'nro']) || getValue(dest, ['enderDest', 'nro']);
    
    // If we don't have explicit number fields, try to extract them from addresses
    let emitenteEnderecoFinal = emitentEndereco;
    let emitenteNumeroFinal = emitenteNumero;
    
    if (!emitenteNumero && emitentEndereco) {
      const { address, number } = splitAddressAndNumber(emitentEndereco);
      emitenteEnderecoFinal = address;
      emitenteNumeroFinal = number;
    }
    
    let destinatarioEnderecoFinal = destinatarioEndereco;
    let destinatarioNumeroFinal = destinatarioNumero;
    
    if (!destinatarioNumero && destinatarioEndereco) {
      const { address, number } = splitAddressAndNumber(destinatarioEndereco);
      destinatarioEnderecoFinal = address;
      destinatarioNumeroFinal = number;
    }
    
    // Extract infCpl for informacoes complementares
    const informacoesComplementares = getValue(infAdic, ['infcpl']) || getValue(infAdic, ['infCpl']);
    console.log("Informações complementares extraídas:", informacoesComplementares);
    
    // Extract volumesTotal field properly
    const volumesTotal = getValue(transp, ['vol', 'qvol']) || 
                         getValue(transp, ['vol', 'qVol']) ||
                         getValue(transp, ['volumes']) ||
                         '';
                         
    console.log("Volumes totais extraídos:", volumesTotal);
    
    // Extracting data with the helper function
    const result: Record<string, any> = {
      // Note data
      chaveNF: chaveNF,
      numeroNF: getValue(ide, ['nnf']) || getValue(ide, ['nNF']),
      serieNF: getValue(ide, ['serie']),
      dataHoraEmissao: emissionDate,
      valorTotal: getValue(total, ['icmstot', 'vnf']) || getValue(total, ['ICMSTot', 'vNF']),
      numeroPedido: orderNumber, // Updated to use product-based order number
      
      // Sender data
      emitenteCNPJ: getValue(emit, ['cnpj']) || getValue(emit, ['CNPJ']),
      emitenteRazaoSocial: getValue(emit, ['xnome']) || getValue(emit, ['xNome']),
      emitenteTelefone: getValue(emit, ['enderemit', 'fone']) || getValue(emit, ['enderEmit', 'fone']),
      emitenteUF: getValue(emit, ['enderemit', 'uf']) || getValue(emit, ['enderEmit', 'UF']),
      emitenteCidade: getValue(emit, ['enderemit', 'xmun']) || getValue(emit, ['enderEmit', 'xMun']),
      emitenteBairro: getValue(emit, ['enderemit', 'xbairro']) || getValue(emit, ['enderEmit', 'xBairro']),
      emitenteEndereco: emitenteEnderecoFinal,
      emitenteNumero: emitenteNumeroFinal,
      emitenteCEP: getValue(emit, ['enderemit', 'cep']) || getValue(emit, ['enderEmit', 'CEP']),
      
      // Recipient data
      destinatarioCNPJ: getValue(dest, ['cnpj']) || getValue(dest, ['CNPJ']),
      destinatarioRazaoSocial: getValue(dest, ['xnome']) || getValue(dest, ['xNome']),
      destinatarioTelefone: getValue(dest, ['enderdest', 'fone']) || getValue(dest, ['enderDest', 'fone']),
      destinatarioUF: getValue(dest, ['enderdest', 'uf']) || getValue(dest, ['enderDest', 'UF']),
      destinatarioCidade: getValue(dest, ['enderdest', 'xmun']) || getValue(dest, ['enderDest', 'xMun']),
      destinatarioBairro: getValue(dest, ['enderdest', 'xbairro']) || getValue(dest, ['enderDest', 'xBairro']),
      destinatarioEndereco: destinatarioEnderecoFinal,
      destinatarioNumero: destinatarioNumeroFinal,
      destinatarioCEP: getValue(dest, ['enderdest', 'cep']) || getValue(dest, ['enderDest', 'CEP']),
      
      // Transport information
      responsavelEntrega: getValue(transp, ['transporta', 'xnome']) || getValue(transp, ['transporta', 'xNome']),
      motorista: getValue(transp, ['veictransp', 'placa']) ? 
        `Placa: ${getValue(transp, ['veictransp', 'placa'])}` : '',
      volumesTotal: volumesTotal,
      volumesTotais: volumesTotal, // Add both formats to ensure compatibility
      pesoTotalBruto: getValue(transp, ['vol', 'pesob']) || getValue(transp, ['vol', 'pesoB']),
      
      // Additional information
      informacoesComplementares: informacoesComplementares,
    };
    
    // Adiciona campos adicionais para preencher na interface
    result.localArmazenagem = '';
    result.tempoArmazenamento = '';
    result.entregueAoFornecedor = 'nao';
    result.observacoes = '';
    
    return result;
  } catch (error) {
    console.error("Erro ao extrair dados do XML:", error);
    return {};
  }
};

/**
 * Mock data search for a nota fiscal
 */
export const searchNotaFiscalByChave = async (chaveNF: string): Promise<Partial<NotaFiscalSchemaType>> => {
  console.log('Buscando nota fiscal pela chave:', chaveNF);
  
  // Simulate an API call with setTimeout
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate filling in some fields
      resolve({
        numeroNF: '654321',
        serieNF: '001',
        dataHoraEmissao: '2023-05-10',
        valorTotal: '1850.75',
        emitenteRazaoSocial: 'Fornecedor ABC Ltda',
        emitenteCNPJ: '12.345.678/0001-90',
      });
    }, 1500);
  });
};
