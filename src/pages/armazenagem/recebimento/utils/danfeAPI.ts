
/**
 * DANFE API integration with meudanfe.com.br
 * This service allows converting XML to DANFE PDF documents
 */

const DANFE_API_URL = 'https://ws.meudanfe.com/api/v1/get/nfe/xmltodanfepdf/API';

/**
 * Convert XML to DANFE PDF using meudanfe.com.br API
 * 
 * @param xmlContent Raw XML content of the NFe
 * @returns Base64 encoded PDF content or null if the request failed
 */
export const generateDANFEFromXML = async (xmlContent: string): Promise<string | null> => {
  try {
    console.log('Sending XML to DANFE API...');
    
    // Verifica se o XML possui o atributo Id no formato correto
    // O Id deve ter exatamente 44 dígitos após o prefixo 'NFe'
    const idMatch = xmlContent.match(/Id="(NFe\d{44})"/);
    
    // Se não encontrar um Id válido, tenta corrigir o XML
    if (!idMatch) {
      console.log('XML não possui Id válido, tentando corrigir...');
      
      // Verifica se há um Id no formato incorreto
      const invalidIdMatch = xmlContent.match(/Id="(NFe\d{1,43})"/);
      if (invalidIdMatch) {
        // Extrai o número da NF
        const nfNumberMatch = xmlContent.match(/<nNF>(\d+)<\/nNF>/);
        const nfNumber = nfNumberMatch ? nfNumberMatch[1] : '000000000';
        
        // Gera um novo Id com 44 dígitos
        const newId = `NFe${'0'.repeat(44 - nfNumber.length)}${nfNumber}`;
        
        // Substitui o Id inválido pelo novo Id
        xmlContent = xmlContent.replace(/Id="NFe[^"]*"/, `Id="${newId}"`);
        console.log('XML corrigido com novo Id:', newId);
      }
    }
    
    const response = await fetch(DANFE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: xmlContent,
    });

    if (!response.ok) {
      console.error(`Error generating DANFE: HTTP ${response.status}`);
      throw new Error(`Failed to generate DANFE: HTTP ${response.status}`);
    }

    // Get the response content
    const responseText = await response.text();
    
    // Remove quotes if present (as mentioned in the API documentation)
    const base64Content = responseText.replace(/^"|"$/g, '');
    
    console.log('DANFE PDF generated successfully');
    return base64Content;
  } catch (error) {
    console.error('Error generating DANFE PDF:', error);
    return null;
  }
};

/**
 * Create a data URL from base64 encoded PDF content
 */
export const createPDFDataUrl = (base64Content: string): string => {
  return `data:application/pdf;base64,${base64Content}`;
};

/**
 * Convert base64 PDF to Blob object for download
 */
export const base64ToBlob = (base64Content: string): Blob => {
  const byteCharacters = atob(base64Content);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: 'application/pdf' });
};
