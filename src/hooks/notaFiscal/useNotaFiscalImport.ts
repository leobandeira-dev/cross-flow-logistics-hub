
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { criarNotaFiscal } from '@/services/notaFiscal/createNotaFiscalService';
import { parseXmlFile } from '@/pages/armazenagem/recebimento/utils/xmlParser';
import { extractDataFromXml } from '@/pages/armazenagem/recebimento/utils/notaFiscalExtractor';

export const useNotaFiscalImport = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importedNotas, setImportedNotas] = useState<any[]>([]);
  const queryClient = useQueryClient();

  const processXMLFile = async (file: File) => {
    try {
      // Parse XML file
      const xmlData = await parseXmlFile(file);
      if (!xmlData) {
        throw new Error('Formato de XML inválido');
      }

      // Extract nota fiscal data
      const extractedData = extractDataFromXml(xmlData);
      
      if (!extractedData.numeroNF) {
        throw new Error('Número da nota fiscal não encontrado no XML');
      }

      // Prepare data for database
      const notaFiscalData = {
        numero: extractedData.numeroNF,
        serie: extractedData.serieNF || '1',
        chave_acesso: extractedData.chaveNF || null,
        valor_total: parseFloat(extractedData.valorTotal) || 0,
        peso_bruto: parseFloat(extractedData.pesoTotalBruto) || null,
        quantidade_volumes: parseInt(extractedData.volumesTotal) || null,
        data_emissao: extractedData.dataHoraEmissao ? 
          new Date(extractedData.dataHoraEmissao).toISOString() : 
          new Date().toISOString(),
        status: 'entrada',
        tipo: 'entrada',
        observacoes: `Importado do XML: ${file.name}. ${extractedData.informacoesComplementares || ''}`
      };

      return { extractedData, notaFiscalData, fileName: file.name };
    } catch (error) {
      console.error('Erro ao processar XML:', error);
      throw error;
    }
  };

  const importSingleXML = async (file: File) => {
    setIsImporting(true);
    try {
      const { extractedData, notaFiscalData } = await processXMLFile(file);
      
      // Save to database
      const novaNota = await criarNotaFiscal(notaFiscalData);
      
      // Add extracted data for form population
      const notaCompleta = {
        ...novaNota,
        ...extractedData
      };
      
      setImportedNotas(prev => [...prev, notaCompleta]);
      
      // Invalidate queries to refresh lists
      queryClient.invalidateQueries({ queryKey: ['notas-fiscais'] });
      
      toast({
        title: "XML importado com sucesso",
        description: `Nota fiscal ${notaFiscalData.numero} foi salva no banco de dados.`,
      });
      
      return notaCompleta;
    } catch (error: any) {
      toast({
        title: "Erro na importação",
        description: error.message || "Não foi possível processar o arquivo XML.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  const importBatchXML = async (files: File[]) => {
    setIsImporting(true);
    const results = [];
    let successCount = 0;
    let errorCount = 0;
    
    try {
      for (const file of files) {
        try {
          const { extractedData, notaFiscalData } = await processXMLFile(file);
          
          // Save to database
          const novaNota = await criarNotaFiscal(notaFiscalData);
          
          // Add extracted data
          const notaCompleta = {
            ...novaNota,
            ...extractedData
          };
          
          results.push(notaCompleta);
          successCount++;
        } catch (error) {
          console.error(`Erro no arquivo ${file.name}:`, error);
          errorCount++;
        }
      }
      
      setImportedNotas(prev => [...prev, ...results]);
      
      // Invalidate queries to refresh lists
      queryClient.invalidateQueries({ queryKey: ['notas-fiscais'] });
      
      toast({
        title: "Importação em lote concluída",
        description: `${successCount} arquivo(s) importado(s) com sucesso${errorCount > 0 ? `. ${errorCount} arquivo(s) com erro.` : '.'}`,
      });
      
      return results;
    } catch (error: any) {
      toast({
        title: "Erro na importação em lote",
        description: "Não foi possível processar os arquivos XML.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  const clearImported = () => {
    setImportedNotas([]);
  };

  return {
    isImporting,
    importedNotas,
    importSingleXML,
    importBatchXML,
    clearImported
  };
};
