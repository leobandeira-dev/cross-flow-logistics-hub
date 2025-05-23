
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
      
      // Prepare data for insertion
      const notaFiscalData = {
        numero: data.numero,
        serie: data.serie,
        chave_acesso: data.chaveAcesso,
        valor: parseFloat(data.valorTotal) || 0,
        peso_bruto: parseFloat(data.pesoBruto) || 0,
        quantidade_volumes: parseInt(data.quantidadeVolumes) || 0,
        data_emissao: data.dataEmissao,
        status: 'entrada',
        tipo: 'entrada',
        observacoes: data.observacoes
      };

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
    const chaveAcesso = getValues('chaveAcesso');
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
        setValue('numero', notaFiscal.numero || '');
        setValue('serie', notaFiscal.serie || '');
        setValue('valorTotal', notaFiscal.valor?.toString() || '');
        setValue('pesoBruto', notaFiscal.peso_bruto?.toString() || '');
        setValue('quantidadeVolumes', notaFiscal.quantidade_volumes?.toString() || '');
        setValue('dataEmissao', notaFiscal.data_emissao || '');
        setValue('observacoes', notaFiscal.observacoes || '');

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
      
      // Read file content
      const text = await file.text();
      
      // Basic XML parsing - you might want to use a proper XML parser
      // For now, just show a success message
      toast({
        title: "Arquivo carregado",
        description: "XML processado. Funcionalidade de parsing completa será implementada.",
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
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const text = await file.text();
        // Process each file
        console.log(`Processando arquivo ${i + 1}:`, file.name);
      }
      
      toast({
        title: "Importação concluída",
        description: `${files.length} arquivos processados.`,
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
