
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { criarNotaFiscal } from '@/services/notaFiscal/createNotaFiscalService';
import { parseXmlFile } from '@/pages/armazenagem/recebimento/utils/xmlParser';

export const useNotaFiscalImport = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importedNotas, setImportedNotas] = useState<any[]>([]);
  const queryClient = useQueryClient();

  const extractBasicDataFromXml = (xmlData: any) => {
    try {
      console.log('Estrutura do XML recebido:', xmlData);
      
      // Navegar pela estrutura XML de forma mais robusta
      let nfe = null;
      let infNFe = null;
      
      // Tentar diferentes estruturas comuns de NFe
      if (xmlData.nfeproc) {
        nfe = xmlData.nfeproc.nfe || xmlData.nfeproc.NFe;
      } else if (xmlData.NFe) {
        nfe = xmlData.NFe;
      } else if (xmlData.nfe) {
        nfe = xmlData.nfe;
      }
      
      if (nfe) {
        infNFe = nfe.infnfe || nfe.infNFe;
      }
      
      if (!infNFe) {
        console.error('Estrutura NFe não encontrada no XML');
        throw new Error('Estrutura de NFe não encontrada no XML');
      }
      
      console.log('infNFe encontrada:', infNFe);
      
      const ide = infNFe.ide || {};
      const total = infNFe.total || {};
      const icmsTot = total.icmstot || total.ICMSTot || {};
      const transp = infNFe.transp || {};
      const vol = transp.vol || {};
      
      // Extrair dados básicos
      const numeroNF = ide.nnf || ide.nNF || '';
      const serieNF = ide.serie || '1';
      const valorTotal = parseFloat(icmsTot.vnf || icmsTot.vNF || '0');
      const dataEmissao = ide.dhemi || ide.dhEmi || ide.demi || ide.dEmi || '';
      const pesoTotalBruto = parseFloat(vol.pesob || vol.pesoB || '0');
      const volumesTotal = parseInt(vol.qvol || vol.qVol || '1');
      
      // Processar chave de acesso
      let chaveNF = '';
      if (xmlData.nfeproc && xmlData.nfeproc.protNFe && xmlData.nfeproc.protNFe.infProt) {
        chaveNF = xmlData.nfeproc.protNFe.infProt.chNFe || '';
      } else if (infNFe.Id) {
        const idMatch = infNFe.Id.toString().match(/NFe(\d+)/i);
        if (idMatch && idMatch[1]) {
          chaveNF = idMatch[1];
        }
      }
      
      console.log('Dados extraídos:', {
        numeroNF,
        serieNF,
        valorTotal,
        dataEmissao,
        pesoTotalBruto,
        volumesTotal,
        chaveNF
      });
      
      return {
        numeroNF,
        serieNF,
        valorTotal,
        dataEmissao,
        pesoTotalBruto,
        volumesTotal,
        chaveNF
      };
    } catch (error) {
      console.error('Erro na extração de dados:', error);
      throw error;
    }
  };

  const processXMLFile = async (file: File) => {
    try {
      console.log('Processando arquivo XML:', file.name);
      
      // Parse XML file
      const xmlData = await parseXmlFile(file);
      if (!xmlData) {
        throw new Error('Formato de XML inválido');
      }
      
      console.log('XML parseado com sucesso');
      
      // Extract nota fiscal data usando função simplificada
      const extractedData = extractBasicDataFromXml(xmlData);
      
      if (!extractedData.numeroNF) {
        throw new Error('Número da nota fiscal não encontrado no XML');
      }
      
      // Processar data de emissão
      let validDataEmissao: string;
      try {
        if (extractedData.dataEmissao) {
          validDataEmissao = new Date(extractedData.dataEmissao).toISOString();
        } else {
          validDataEmissao = new Date().toISOString();
        }
      } catch (error) {
        console.warn('Data de emissão inválida, usando data atual:', extractedData.dataEmissao);
        validDataEmissao = new Date().toISOString();
      }

      // Prepare data for database
      const notaFiscalData = {
        numero: extractedData.numeroNF.toString(),
        serie: extractedData.serieNF.toString() || '1',
        chave_acesso: extractedData.chaveNF || null,
        valor_total: extractedData.valorTotal || 0,
        peso_bruto: extractedData.pesoTotalBruto || null,
        quantidade_volumes: extractedData.volumesTotal || null,
        data_emissao: validDataEmissao,
        status: 'entrada',
        tipo: 'entrada',
        observacoes: `Importado do XML: ${file.name}`
      };
      
      console.log('Dados preparados para inserção no banco:', notaFiscalData);

      return { extractedData, notaFiscalData, fileName: file.name };
    } catch (error) {
      console.error('Erro ao processar XML:', error);
      throw error;
    }
  };

  const importSingleXML = async (file: File) => {
    setIsImporting(true);
    try {
      console.log('Iniciando importação de XML único:', file.name);
      
      const { extractedData, notaFiscalData } = await processXMLFile(file);
      
      console.log('Tentando salvar no banco de dados...');
      
      // Save to database
      const novaNota = await criarNotaFiscal(notaFiscalData);
      
      console.log('Nota fiscal salva com sucesso:', novaNota);
      
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
      console.error('Erro na importação:', error);
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
      console.log('Iniciando importação em lote de', files.length, 'arquivos');
      
      for (const file of files) {
        try {
          console.log('Processando arquivo em lote:', file.name);
          
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
          
          console.log('Arquivo processado com sucesso:', file.name);
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
      console.error('Erro na importação em lote:', error);
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
