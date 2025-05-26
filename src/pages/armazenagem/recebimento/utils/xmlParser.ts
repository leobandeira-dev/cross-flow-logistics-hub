
/**
 * Utility functions for parsing XML files
 */

/**
 * Parse an XML file into a JavaScript object
 */
export const parseXmlFile = async (file: File): Promise<Record<string, any> | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        try {
          const xmlContent = e.target.result as string;
          console.log('Conteúdo XML lido (primeiros 500 chars):', xmlContent.substring(0, 500));
          
          // Parse XML using DOMParser
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
          
          // Check for parsing errors
          const parseError = xmlDoc.getElementsByTagName("parsererror");
          if (parseError.length > 0) {
            console.error("Erro ao fazer parse do XML:", parseError[0].textContent);
            reject(new Error("Formato de XML inválido"));
            return;
          }
          
          console.log("XML parseado com sucesso usando DOMParser");
          
          // Convert XML Document to JavaScript object
          const result = xmlDocumentToObject(xmlDoc);
          console.log("XML convertido para objeto:", result);
          
          resolve(result);
        } catch (error) {
          console.error("Erro ao processar o XML:", error);
          reject(error);
        }
      } else {
        reject(new Error("Não foi possível ler o conteúdo do arquivo"));
      }
    };
    
    reader.onerror = () => {
      console.error("Erro na leitura do arquivo");
      reject(new Error("Erro na leitura do arquivo"));
    };
    
    reader.readAsText(file, 'utf-8');
  });
};

/**
 * Convert an XML Document to a JavaScript object
 */
export const xmlDocumentToObject = (xmlDoc: Document): Record<string, any> => {
  const convertElement = (element: Element): any => {
    const result: any = {};
    
    // Add attributes
    if (element.attributes && element.attributes.length > 0) {
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        result[`@${attr.name}`] = attr.value;
      }
    }
    
    // Process child nodes
    const children = element.childNodes;
    let textContent = '';
    
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.nodeValue?.trim();
        if (text) {
          textContent += text;
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const childElement = child as Element;
        const tagName = childElement.tagName;
        const childResult = convertElement(childElement);
        
        if (result[tagName]) {
          // If already exists, convert to array
          if (!Array.isArray(result[tagName])) {
            result[tagName] = [result[tagName]];
          }
          result[tagName].push(childResult);
        } else {
          result[tagName] = childResult;
        }
      }
    }
    
    // If only text content and no child elements, return the text
    if (Object.keys(result).length === 0 && textContent) {
      return textContent;
    }
    
    // If has text and elements, add text as special property
    if (textContent && Object.keys(result).length > 0) {
      result['#text'] = textContent;
    }
    
    return result;
  };
  
  // Start with root element
  const rootElement = xmlDoc.documentElement;
  const rootTagName = rootElement.tagName;
  
  return {
    [rootTagName]: convertElement(rootElement)
  };
};
