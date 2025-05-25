
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { criarNotaFiscal } from '@/services/notaFiscal/createNotaFiscalService';
import { buscarNotaFiscalPorChave } from '@/services/notaFiscal/fetchNotaFiscalService';
import { NotaFiscalSchemaType } from './notaFiscalSchema';

export const useNotaFiscalForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: NotaFiscalSchemaType) => {
    setIsLoading(true);
    try {
      console.log('Cadastrando nota fiscal:', data);
      
      // Validate and prepare data for insertion
      const notaFiscalData = {
        numero: data.numeroNF || `NF-${Date.now()}`,
        serie: data.serieNF || '1',
        chave_acesso: data.chaveNF || '',
        valor_total: parseFloat(data.valorTotal) || 0,
        peso_bruto: parseFloat(data.pesoTotalBruto) || 0,
        quantidade_volumes: parseInt(data.volumesTotal) || 1,
        // Handle empty dates properly
        data_emissao: data.dataHoraEmissao ? new Date(data.dataHoraEmissao).toISOString() : new Date().toISOString(),
        status: 'entrada',
        tipo: 'entrada',
        observacoes: data.informacoesComplementares || null
      };

      console.log('Dados preparados para inserção:', notaFiscalData);

      const notaFiscal = await criarNotaFiscal(notaFiscalData);

      console.log('Nota fiscal criada:', notaFiscal);

      toast({
        title: "Sucesso",
        description: "Nota fiscal cadastrada com sucesso!",
      });

      return notaFiscal;
    } catch (error: any) {
      console.error('Erro ao cadastrar nota fiscal:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao cadastrar nota fiscal",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeySearch = async (getValues: any, setValue: any) => {
    const chaveAcesso = getValues('chaveNF');
    if (!chaveAcesso) {
      toast({
        title: "Erro",
        description: "Informe a chave de acesso da nota fiscal",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Buscando nota fiscal por chave:', chaveAcesso);
      
      const notaFiscal = await buscarNotaFiscalPorChave(chaveAcesso);
      
      if (notaFiscal) {
        // Populate form with found data
        setValue('numeroNF', notaFiscal.numero || '');
        setValue('serieNF', notaFiscal.serie || '');
        setValue('valorTotal', notaFiscal.valor_total?.toString() || '');
        setValue('pesoTotalBruto', notaFiscal.peso_bruto?.toString() || '');
        setValue('volumesTotal', notaFiscal.quantidade_volumes?.toString() || '');
        setValue('dataHoraEmissao', notaFiscal.data_emissao ? 
          new Date(notaFiscal.data_emissao).toISOString().slice(0, 16) : '');
        setValue('informacoesComplementares', notaFiscal.observacoes || '');

        toast({
          title: "Sucesso",
          description: "Nota fiscal encontrada e dados preenchidos!",
        });
      } else {
        toast({
          title: "Aviso",
          description: "Nota fiscal não encontrada no banco de dados",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Erro ao buscar nota fiscal:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao buscar nota fiscal",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setValue: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      console.log('Processando arquivo XML:', file.name);
      
      const text = await file.text();
      console.log('Conteúdo XML carregado:', text.substring(0, 200) + '...');
      
      // Parse XML and extract data (simplified for now)
      // In a real implementation, you would use proper XML parsing
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");
      
      // Extract basic fields from XML
      const numeroNF = xmlDoc.querySelector('nNF')?.textContent || '';
      const serieNF = xmlDoc.querySelector('serie')?.textContent || '';
      const valorTotal = xmlDoc.querySelector('vNF')?.textContent || '';
      const dataEmissao = xmlDoc.querySelector('dhEmi')?.textContent || '';
      
      if (numeroNF) setValue('numeroNF', numeroNF);
      if (serieNF) setValue('serieNF', serieNF);
      if (valorTotal) setValue('valorTotal', valorTotal);
      if (dataEmissao) {
        // Convert XML date format to input format
        const date = new Date(dataEmissao);
        if (!isNaN(date.getTime())) {
          setValue('dataHoraEmissao', date.toISOString().slice(0, 16));
        }
      }
      
      toast({
        title: "Arquivo carregado",
        description: "Dados extraídos do XML e preenchidos no formulário.",
      });
      
    } catch (error: any) {
      console.error('Erro ao processar XML:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar arquivo XML",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchImport = async (files: FileList, setValue: any) => {
    if (!files.length) return;

    setIsLoading(true);
    try {
      console.log('Processando importação em lote:', files.length, 'arquivos');
      let successCount = 0;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const text = await file.text();
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(text, "text/xml");
          
          // Extract data and create nota fiscal
          const numeroNF = xmlDoc.querySelector('nNF')?.textContent || `NF-${Date.now()}-${i}`;
          const serieNF = xmlDoc.querySelector('serie')?.textContent || '1';
          const valorTotal = parseFloat(xmlDoc.querySelector('vNF')?.textContent || '0');
          const dataEmissao = xmlDoc.querySelector('dhEmi')?.textContent;
          
          const notaFiscalData = {
            numero: numeroNF,
            serie: serieNF,
            valor_total: valorTotal,
            data_emissao: dataEmissao ? new Date(dataEmissao).toISOString() : new Date().toISOString(),
            status: 'entrada',
            tipo: 'entrada'
          };
          
          await criarNotaFiscal(notaFiscalData);
          successCount++;
          
        } catch (error) {
          console.error(`Erro ao processar arquivo ${file.name}:`, error);
        }
      }
      
      toast({
        title: "Importação concluída",
        description: `${successCount} de ${files.length} arquivo(s) processado(s) com sucesso.`,
      });
      
    } catch (error: any) {
      console.error('Erro na importação em lote:', error);
      toast({
        title: "Erro",
        description: "Erro na importação em lote",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSubmit,
    handleKeySearch,
    handleFileUpload,
    handleBatchImport
  };
};
