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
      
      // Navigate through the XML structure more robustly
      let nfe = null;
      let infNFe = null;
      let protNFe = null;
      
      // Try different common NFe structures
      if (xmlData.nfeproc) {
        nfe = xmlData.nfeproc.nfe || xmlData.nfeproc.NFe;
        protNFe = xmlData.nfeproc.protNFe;
      } else if (xmlData.nfeProc) {
        nfe = xmlData.nfeProc.nfe || xmlData.nfeProc.NFe;
        protNFe = xmlData.nfeProc.protNFe;
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
      const emit = infNFe.emit || {};
      const dest = infNFe.dest || {};
      const total = infNFe.total || {};
      const icmsTot = total.icmstot || total.ICMSTot || {};
      const transp = infNFe.transp || {};
      const vol = transp.vol || {};
      const infAdic = infNFe.infadic || infNFe.infAdic || {};
      
      // Extract basic data
      const numeroNF = ide.nnf || ide.nNF || '';
      const serieNF = ide.serie || '1';
      const valorTotal = parseFloat(icmsTot.vnf || icmsTot.vNF || '0');
      const dataEmissao = ide.dhemi || ide.dhEmi || ide.demi || ide.dEmi || '';
      const pesoTotalBruto = parseFloat(vol.pesob || vol.pesoB || '0');
      const volumesTotal = parseInt(vol.qvol || vol.qVol || '1');
      const tipoOperacao = ide.tpnf || ide.tpNF || '';
      
      // Extract company data
      const emitenteRazao = emit.xnome || emit.xNome || '';
      const emitenteCNPJ = emit.cnpj || emit.CNPJ || '';
      const emitenteFone = emit.enderemit?.fone || emit.enderEmit?.fone || '';
      
      const destinatarioRazao = dest.xnome || dest.xNome || '';
      const destinatarioCNPJ = dest.cnpj || dest.CNPJ || '';
      const destinatarioFone = dest.enderdest?.fone || dest.enderDest?.fone || '';
      
      // Extract addresses
      const emitenteEndereco = emit.enderemit || emit.enderEmit || {};
      const destinatarioEndereco = dest.enderdest || dest.enderDest || {};
      
      // Process chave de acesso (access key)
      let chaveNF = '';
      if (protNFe && protNFe.infProt && protNFe.infProt.chNFe) {
        chaveNF = protNFe.infProt.chNFe;
      } else if (infNFe.Id) {
        const idMatch = infNFe.Id.toString().match(/NFe(\d+)/i);
        if (idMatch && idMatch[1]) {
          chaveNF = idMatch[1];
        }
      }
      
      // Extract additional information
      const informacoesComplementares = infAdic.infcpl || infAdic.infCpl || '';
      
      // Try to extract order number from additional info
      let numeroPedido = '';
      if (informacoesComplementares) {
        const pedidoRegex = /pedido[:\s]*(\d+[-]?\d*)/i;
        const match = informacoesComplementares.match(pedidoRegex);
        if (match && match[1]) {
          numeroPedido = match[1].replace(/-/g, '');
        }
      }
      
      console.log('Dados extraídos:', {
        numeroNF,
        serieNF,
        valorTotal,
        dataEmissao,
        pesoTotalBruto,
        volumesTotal,
        chaveNF,
        tipoOperacao,
        emitenteRazao,
        emitenteCNPJ,
        destinatarioRazao,
        destinatarioCNPJ,
        numeroPedido,
        informacoesComplementares
      });
      
      return {
        numeroNF,
        serieNF,
        valorTotal,
        dataEmissao,
        pesoTotalBruto,
        volumesTotal,
        chaveNF,
        tipoOperacao,
        emitenteRazao,
        emitenteCNPJ,
        emitenteFone,
        destinatarioRazao,
        destinatarioCNPJ,
        destinatarioFone,
        emitenteEndereco: {
          logradouro: emitenteEndereco.xlgr || emitenteEndereco.xLgr || '',
          numero: emitenteEndereco.nro || '',
          bairro: emitenteEndereco.xbairro || emitenteEndereco.xBairro || '',
          cidade: emitenteEndereco.xmun || emitenteEndereco.xMun || '',
          uf: emitenteEndereco.uf || emitenteEndereco.UF || '',
          cep: emitenteEndereco.cep || emitenteEndereco.CEP || ''
        },
        destinatarioEndereco: {
          logradouro: destinatarioEndereco.xlgr || destinatarioEndereco.xLgr || '',
          numero: destinatarioEndereco.nro || '',
          bairro: destinatarioEndereco.xbairro || destinatarioEndereco.xBairro || '',
          cidade: destinatarioEndereco.xmun || destinatarioEndereco.xMun || '',
          uf: destinatarioEndereco.uf || destinatarioEndereco.UF || '',
          cep: destinatarioEndereco.cep || destinatarioEndereco.CEP || ''
        },
        numeroPedido,
        informacoesComplementares
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
      
      // Extract nota fiscal data
      const extractedData = extractBasicDataFromXml(xmlData);
      
      if (!extractedData.numeroNF) {
        throw new Error('Número da nota fiscal não encontrado no XML');
      }
      
      // Process emission date
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

      // Prepare data for database with all extracted fields
      const notaFiscalData = {
        numero: extractedData.numeroNF.toString(),
        serie: extractedData.serieNF.toString() || '1',
        chave_acesso: extractedData.chaveNF || null,
        valor_total: extractedData.valorTotal || 0,
        peso_bruto: extractedData.pesoTotalBruto || null,
        quantidade_volumes: extractedData.volumesTotal || null,
        data_emissao: validDataEmissao,
        data_hora_emissao: validDataEmissao,
        status: 'pendente',
        tipo: 'entrada',
        tipo_operacao: extractedData.tipoOperacao || null,
        
        // Dados do emitente
        emitente_cnpj: extractedData.emitenteCNPJ || null,
        emitente_razao_social: extractedData.emitenteRazao || null,
        emitente_telefone: extractedData.emitenteFone || null,
        emitente_uf: extractedData.emitenteEndereco?.uf || null,
        emitente_cidade: extractedData.emitenteEndereco?.cidade || null,
        emitente_bairro: extractedData.emitenteEndereco?.bairro || null,
        emitente_endereco: extractedData.emitenteEndereco?.logradouro || null,
        emitente_numero: extractedData.emitenteEndereco?.numero || null,
        emitente_cep: extractedData.emitenteEndereco?.cep || null,
        
        // Dados do destinatário
        destinatario_cnpj: extractedData.destinatarioCNPJ || null,
        destinatario_razao_social: extractedData.destinatarioRazao || null,
        destinatario_telefone: extractedData.destinatarioFone || null,
        destinatario_uf: extractedData.destinatarioEndereco?.uf || null,
        destinatario_cidade: extractedData.destinatarioEndereco?.cidade || null,
        destinatario_bairro: extractedData.destinatarioEndereco?.bairro || null,
        destinatario_endereco: extractedData.destinatarioEndereco?.logradouro || null,
        destinatario_numero: extractedData.destinatarioEndereco?.numero || null,
        destinatario_cep: extractedData.destinatarioEndereco?.cep || null,
        
        // Campos adicionais
        numero_pedido: extractedData.numeroPedido || null,
        informacoes_complementares: extractedData.informacoesComplementares || null,
        
        observacoes: `Importado do XML: ${file.name}. Emitente: ${extractedData.emitenteRazao}. Destinatário: ${extractedData.destinatarioRazao}.`
      };
      
      console.log('Dados preparados para inserção no banco:', notaFiscalData);

      return { 
        extractedData, 
        notaFiscalData, 
        fileName: file.name,
        fullExtractedData: extractedData // Include all extracted data for form population
      };
    } catch (error) {
      console.error('Erro ao processar XML:', error);
      throw error;
    }
  };

  const importSingleXML = async (file: File) => {
    setIsImporting(true);
    try {
      console.log('Iniciando importação de XML único:', file.name);
      
      const { extractedData, notaFiscalData, fullExtractedData } = await processXMLFile(file);
      
      console.log('Tentando salvar no banco de dados...');
      
      // Save to database
      const novaNota = await criarNotaFiscal(notaFiscalData);
      
      console.log('Nota fiscal salva com sucesso:', novaNota);
      
      // Combine database data with extracted XML data for complete form population
      const notaCompleta = {
        ...novaNota,
        ...fullExtractedData,
        // Map additional fields for form compatibility
        numeroNF: extractedData.numeroNF,
        serieNF: extractedData.serieNF,
        chaveNF: extractedData.chaveNF,
        valorTotal: extractedData.valorTotal,
        pesoTotalBruto: extractedData.pesoTotalBruto,
        volumesTotal: extractedData.volumesTotal,
        // Company data
        emitenteRazaoSocial: extractedData.emitenteRazao,
        emitenteCNPJ: extractedData.emitenteCNPJ,
        destinatarioRazaoSocial: extractedData.destinatarioRazao,
        destinatarioCNPJ: extractedData.destinatarioCNPJ,
        // Address data
        emitenteEndereco: extractedData.emitenteEndereco?.logradouro,
        emitenteNumero: extractedData.emitenteEndereco?.numero,
        emitenteBairro: extractedData.emitenteEndereco?.bairro,
        emitenteCidade: extractedData.emitenteEndereco?.cidade,
        emitenteUF: extractedData.emitenteEndereco?.uf,
        emitenteCEP: extractedData.emitenteEndereco?.cep,
        destinatarioEndereco: extractedData.destinatarioEndereco?.logradouro,
        destinatarioNumero: extractedData.destinatarioEndereco?.numero,
        destinatarioBairro: extractedData.destinatarioEndereco?.bairro,
        destinatarioCidade: extractedData.destinatarioEndereco?.cidade,
        destinatarioUF: extractedData.destinatarioEndereco?.uf,
        destinatarioCEP: extractedData.destinatarioEndereco?.cep,
        // Additional fields
        numeroPedido: extractedData.numeroPedido,
        informacoesComplementares: extractedData.informacoesComplementares
      };
      
      setImportedNotas(prev => [...prev, notaCompleta]);
      
      // Invalidate queries to refresh lists
      queryClient.invalidateQueries({ queryKey: ['notas-fiscais'] });
      
      toast({
        title: "XML importado com sucesso",
        description: `Nota fiscal ${notaFiscalData.numero} foi salva no banco de dados e todos os campos foram preenchidos.`,
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
          
          const { extractedData, notaFiscalData, fullExtractedData } = await processXMLFile(file);
          
          // Save to database
          const novaNota = await criarNotaFiscal(notaFiscalData);
          
          // Add complete extracted data
          const notaCompleta = {
            ...novaNota,
            ...fullExtractedData,
            numeroNF: extractedData.numeroNF,
            serieNF: extractedData.serieNF,
            chaveNF: extractedData.chaveNF,
            valorTotal: extractedData.valorTotal,
            pesoTotalBruto: extractedData.pesoTotalBruto,
            volumesTotal: extractedData.volumesTotal,
            emitenteRazaoSocial: extractedData.emitenteRazao,
            emitenteCNPJ: extractedData.emitenteCNPJ,
            destinatarioRazaoSocial: extractedData.destinatarioRazao,
            destinatarioCNPJ: extractedData.destinatarioCNPJ
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
        description: `${successCount} arquivo(s) importado(s) com todos os campos preenchidos${errorCount > 0 ? `. ${errorCount} arquivo(s) com erro.` : '.'}`,
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
