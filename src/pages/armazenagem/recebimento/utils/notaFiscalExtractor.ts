
/**
 * Utility functions for extracting data from XML for Nota Fiscal
 */

import { toast } from "@/hooks/use-toast";

/**
 * Search for a Nota Fiscal using the access key
 */
export const searchNotaFiscalByChave = async (chave: string): Promise<Record<string, any>> => {
  // This is a mock implementation
  // In a real application, this would call your API to search for the NF
  console.log(`Searching for Nota Fiscal with chave: ${chave}`);
  
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock data
      resolve({
        notaFiscal: `NF-${chave.substring(0, 6)}`,
        numeroNF: chave.substring(0, 6),
        chaveNF: chave,
        emitenteRazaoSocial: "EMPRESA EMITENTE LTDA",
        emitenteCNPJ: "12.345.678/0001-90",
        emitenteEndereco: "Rua Exemplo, 123",
        emitenteBairro: "Centro",
        emitenteCidade: "São Paulo",
        emitenteUF: "SP",
        emitenteCEP: "01234-567",
        destinatarioRazaoSocial: "EMPRESA DESTINATÁRIA LTDA",
        destinatarioCNPJ: "98.765.432/0001-10",
        destinatarioEndereco: "Avenida Teste, 456",
        destinatarioBairro: "Jardim",
        destinatarioCidade: "Rio de Janeiro",
        destinatarioUF: "RJ",
        destinatarioCEP: "98765-432",
        valorTotal: "1850.75",
        dataHoraEmissao: "2023-05-10T10:30:00-03:00",
        pesoTotalBruto: "125.500",
        volumesTotal: "5"
      });
    }, 1000);
  });
};

/**
 * Extract data from XML object for a Nota Fiscal
 */
export const extractDataFromXml = (xmlData: any): Record<string, any> => {
  try {
    console.log("Extracting data from XML object:", xmlData);
    
    // Extract NFe data
    const nfe = xmlData.nfe || {};
    const infNFe = nfe.infnfe || {};
    
    // Extract ide section
    const ide = infNFe.ide || {};
    
    // Extract emit section (emitente)
    const emit = infNFe.emit || {};
    const enderEmit = emit.enderemit || {};
    
    // Extract dest section (destinatario)
    const dest = infNFe.dest || {};
    const enderDest = dest.enderdest || {};
    
    // Extract total section
    const total = infNFe.total || {};
    const icmsTot = total.icmstot || {};
    
    // Extract transport section
    const transp = infNFe.transp || {};
    const vol = transp.vol || {};
    
    // Build the extracted data object
    const extractedData = {
      chaveNF: infNFe.id ? infNFe.id.replace('NFe', '') : "",
      numeroNF: ide.nnf || "",
      serieNF: ide.serie || "",
      dataHoraEmissao: ide.dhemi || "",
      valorTotal: icmsTot.vnf || "",
      
      // Emitente data
      emitenteCNPJ: emit.cnpj || "",
      emitenteRazaoSocial: emit.xnome || "",
      emitenteEndereco: `${enderEmit.xlgr || ""}, ${enderEmit.nro || ""}`,
      emitenteBairro: enderEmit.xbairro || "",
      emitenteCidade: enderEmit.xmun || "",
      emitenteUF: enderEmit.uf || "",
      emitenteCEP: enderEmit.cep || "",
      
      // Destinatario data
      destinatarioCNPJ: dest.cnpj || "",
      destinatarioRazaoSocial: dest.xnome || "",
      destinatarioEndereco: `${enderDest.xlgr || ""}, ${enderDest.nro || ""}`,
      destinatarioBairro: enderDest.xbairro || "",
      destinatarioCidade: enderDest.xmun || "",
      destinatarioUF: enderDest.uf || "",
      destinatarioCEP: enderDest.cep || "",
      
      // Volume data - Make sure to extract volumesTotal correctly
      pesoTotalBruto: vol.pesob || vol.pesobruto || "",
      volumesTotal: vol.qvol || ""  // Ensuring we extract the volumesTotal consistently
    };
    
    console.log("Extracted data:", extractedData);
    return extractedData;
    
  } catch (error) {
    console.error("Error extracting data from XML:", error);
    toast({
      title: "Erro",
      description: "Ocorreu um erro ao extrair os dados do XML.",
      variant: "destructive"
    });
    return {};
  }
};
