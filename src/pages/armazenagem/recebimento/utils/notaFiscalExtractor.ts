
import { NotaFiscalSchemaType } from '../components/forms/notaFiscalSchema';

/**
 * Extract data from an XML object to populate a NotaFiscal form
 */
export const extractDataFromXml = (xmlData: any): Partial<NotaFiscalSchemaType> => {
  try {
    console.log("Tentando extrair dados do XML:", xmlData);
    
    // Navigate through the XML structure using the new approach
    const nfeProc = xmlData.nfeproc || xmlData.nfeProc || {};
    
    // Accessing the XML content in a more resilient way
    const nfe = nfeProc.nfe || nfeProc.nfe;
    const infNFe = nfe?.infnfe || nfe?.infnfe;
    
    if (!infNFe) {
      console.error("Estrutura de XML não reconhecida:", xmlData);
      return {};
    }
    
    // Extracting basic data
    const ide = infNFe.ide || {};
    const emit = infNFe.emit || {};
    const dest = infNFe.dest || {};
    const transp = infNFe.transp || {};
    const total = infNFe.total || {};
    const infAdic = infNFe.infadic || {};
    
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

    // New function to extract order number from product details
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

    // Extract order number from product details
    const orderNumber = extractOrderNumberFromProducts(infNFe);
    console.log("Número do pedido extraído dos produtos:", orderNumber);
    
    // Process emission date and time
    let emissionDate = '';
    const dhEmi = getValue(ide, ['dhemi']);
    const dEmi = getValue(ide, ['demi']);
    const hEmi = getValue(ide, ['hemi']);
    
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
    const emitentEndereco = getValue(emit, ['enderemit', 'xlgr']);
    const emitenteNumero = getValue(emit, ['enderemit', 'nro']);
    
    // Process recipient address
    const destinatarioEndereco = getValue(dest, ['enderdest', 'xlgr']);
    const destinatarioNumero = getValue(dest, ['enderdest', 'nro']);
    
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
    
    // Extracting data with the helper function
    return {
      // Note data
      chaveNF: getValue(infNFe, ['id']) || getValue(infNFe, ['Id']),
      numeroNF: getValue(ide, ['nnf']) || getValue(ide, ['nnf']),
      serieNF: getValue(ide, ['serie']),
      dataHoraEmissao: emissionDate,
      valorTotal: getValue(total, ['icmstot', 'vnf']) || getValue(total, ['icmstot', 'vnf']),
      numeroPedido: orderNumber, // Updated to use product-based order number
      
      // Sender data
      emitenteCNPJ: getValue(emit, ['cnpj']),
      emitenteRazaoSocial: getValue(emit, ['xnome']),
      emitenteEndereco: emitenteEnderecoFinal,
      emitenteNumero: emitenteNumeroFinal,
      emitenteBairro: getValue(emit, ['enderemit', 'xbairro']),
      emitenteCidade: getValue(emit, ['enderemit', 'xmun']),
      emitenteUF: getValue(emit, ['enderemit', 'uf']),
      emitenteCEP: getValue(emit, ['enderemit', 'cep']),
      emitenteTelefone: getValue(emit, ['enderemit', 'fone']),
      
      // Recipient data
      destinatarioCNPJ: getValue(dest, ['cnpj']),
      destinatarioRazaoSocial: getValue(dest, ['xnome']),
      destinatarioEndereco: destinatarioEnderecoFinal,
      destinatarioNumero: destinatarioNumeroFinal,
      destinatarioBairro: getValue(dest, ['enderdest', 'xbairro']),
      destinatarioCidade: getValue(dest, ['enderdest', 'xmun']),
      destinatarioUF: getValue(dest, ['enderdest', 'uf']),
      destinatarioCEP: getValue(dest, ['enderdest', 'cep']),
      destinatarioTelefone: getValue(dest, ['enderdest', 'fone']),
      
      // Transport information
      responsavelEntrega: getValue(transp, ['transporta', 'xnome']),
      motorista: getValue(transp, ['veictransp', 'placa']) ? 
        `Placa: ${getValue(transp, ['veictransp', 'placa'])}` : '',
      volumesTotal: getValue(transp, ['vol', 'qvol']),
      pesoTotalBruto: getValue(transp, ['vol', 'pesob']),
    };
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
