
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { criarNotaFiscal } from '@/services/notaFiscal/createNotaFiscalService';

export const useXMLUpload = (onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void) => {
  const [previewLoading, setPreviewLoading] = useState(false);
  const [xmlContent, setXmlContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const queryClient = useQueryClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Call the original onFileUpload function
    onFileUpload(e);
    
    const file = e.target.files?.[0];
    if (file && file.type === 'text/xml') {
      try {
        setPreviewLoading(true);
        setFileName(file.name);
        
        // Read the XML file
        const content = await readFileAsText(file);
        setXmlContent(content);
        
        // Parse XML to extract nota fiscal data
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(content, "text/xml");
        
        // Check for parsing errors
        const parseError = xmlDoc.querySelector('parsererror');
        if (parseError) {
          throw new Error('Erro ao analisar XML: arquivo pode estar corrompido');
        }

        // Extract basic information from XML
        const numeroNF = xmlDoc.querySelector('nNF')?.textContent || '';
        const serieNF = xmlDoc.querySelector('serie')?.textContent || '1';
        const chaveNF = xmlDoc.querySelector('chNFe')?.textContent || '';
        const valorTotal = parseFloat(xmlDoc.querySelector('vNF')?.textContent || '0');
        const dataEmissao = xmlDoc.querySelector('dhEmi')?.textContent || '';
        const pesoTotal = parseFloat(xmlDoc.querySelector('pesoB')?.textContent || '0');
        const volumes = parseInt(xmlDoc.querySelector('qVol')?.textContent || '1');

        // Extract company information
        const emitenteRazao = xmlDoc.querySelector('emit xNome')?.textContent || '';
        const destinatarioRazao = xmlDoc.querySelector('dest xNome')?.textContent || '';

        if (!numeroNF) {
          throw new Error('Número da nota fiscal não encontrado no XML');
        }

        // Prepare data for database insertion
        const notaFiscalData = {
          numero: numeroNF,
          serie: serieNF,
          chave_acesso: chaveNF,
          valor_total: valorTotal,
          peso_bruto: pesoTotal,
          quantidade_volumes: volumes,
          data_emissao: dataEmissao ? new Date(dataEmissao).toISOString() : new Date().toISOString(),
          status: 'entrada',
          tipo: 'entrada',
          observacoes: `Importado do arquivo: ${file.name}`
        };
        
        console.log("Criando nota fiscal do XML:", notaFiscalData);
        
        // Save to database
        const novaNota = await criarNotaFiscal(notaFiscalData);
        
        // Invalidate queries to refresh the data
        queryClient.invalidateQueries({ queryKey: ['notas-fiscais'] });
        
        console.log("Nota fiscal criada do XML:", novaNota);
        
        toast({
          title: "Nota fiscal importada com sucesso",
          description: `A nota fiscal ${numeroNF} foi importada e salva no banco de dados.`,
        });
        
      } catch (error) {
        console.error('Error processing XML file:', error);
        toast({
          title: "Erro",
          description: error instanceof Error ? error.message : "Não foi possível processar o arquivo XML.",
          variant: "destructive"
        });
      } finally {
        setPreviewLoading(false);
      }
    } else if (file) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione apenas arquivos XML.",
        variant: "destructive"
      });
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
