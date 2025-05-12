
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { parseXmlFile } from '../utils/xmlParser';
import { notasFiscais, NotaFiscal } from '../data/mockData';

export const useXMLUpload = (onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void) => {
  const [previewLoading, setPreviewLoading] = useState(false);
  const [xmlContent, setXmlContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Call the original onFileUpload function
    onFileUpload(e);
    
    // Additional functionality for DANFE preview
    const file = e.target.files?.[0];
    if (file && file.type === 'text/xml') {
      try {
        setPreviewLoading(true);
        setFileName(file.name);
        
        // Read the XML file
        const content = await readFileAsText(file);
        setXmlContent(content);
        
        // Parse XML to extract nota fiscal data
        const xmlData = await parseXmlFile(file);
        
        // Add the imported note to the notasFiscais array
        if (xmlData) {
          try {
            // Extract information from XML
            const nfeInfo = xmlData.nfeproc?.nfe?.infnfe;
            const notaId = nfeInfo?.ide?.nnf || `NF-${Math.floor(Math.random() * 100000)}`;
            const numeroNota = nfeInfo?.ide?.nnf || "";
            const fornecedor = nfeInfo?.emit?.xnome || "Fornecedor do XML";
            const dataEmissao = nfeInfo?.ide?.dhemi 
              ? new Date(nfeInfo.ide.dhemi).toLocaleDateString('pt-BR') 
              : new Date().toLocaleDateString('pt-BR');
            const valorTotal = nfeInfo?.total?.icmstot?.vnf || "0,00";
            
            // Create a new nota fiscal object
            const novaNota: NotaFiscal = {
              id: notaId,
              numero: numeroNota,
              fornecedor: fornecedor,
              data: dataEmissao,
              valor: valorTotal,
              status: 'pending',
              xmlContent: content // Store XML content for DANFE generation
            };
            
            // Add to the existing array of notas fiscais
            notasFiscais.unshift(novaNota);
            
            toast({
              title: "Nota fiscal importada com sucesso",
              description: `A nota fiscal ${numeroNota} foi importada e adicionada à lista.`,
            });
          } catch (error) {
            console.error("Erro ao extrair dados do XML:", error);
          }
        }
        
        toast({
          title: "XML carregado",
          description: `O arquivo ${file.name} foi carregado com sucesso.`,
        });
        
      } catch (error) {
        console.error('Error reading XML file:', error);
        toast({
          title: "Erro",
          description: "Não foi possível ler o arquivo XML.",
          variant: "destructive"
        });
      } finally {
        setPreviewLoading(false);
      }
    }
  };

  // Helper function to read file as text
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };

  return {
    previewLoading,
    xmlContent,
    fileName,
    handleFileChange
  };
};
