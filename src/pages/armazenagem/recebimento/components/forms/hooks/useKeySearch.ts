
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { searchNotaFiscalByChave } from '../../../utils/notaFiscalExtractor';
import { buscarNotaFiscalPorChave } from '@/services/notaFiscal/fetchNotaFiscalService';

export const useKeySearch = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleKeySearch = async (getValues: any, setValue: any) => {
    const chaveNF = getValues('chaveNF');
    
    if (!chaveNF) {
      toast({
        title: "Erro",
        description: "Por favor, informe a chave de acesso da nota fiscal.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Set current tab
      setValue('currentTab', 'chave');
      
      // Buscar nota fiscal no Supabase primeiro
      const notaExistente = await buscarNotaFiscalPorChave(chaveNF);
      
      if (notaExistente) {
        // Se encontrou no banco, preencher com os dados existentes
        setValue('numeroNF', notaExistente.numero);
        setValue('serieNF', notaExistente.serie);
        setValue('valorTotal', notaExistente.valor_total?.toString());
        setValue('pesoTotalBruto', notaExistente.peso_bruto?.toString());
        setValue('volumesTotal', notaExistente.quantidade_volumes?.toString());
        setValue('dataHoraEmissao', notaExistente.data_emissao);
        
        // Dados do emitente
        setValue('emitenteCNPJ', notaExistente.emitente_cnpj);
        setValue('emitenteRazaoSocial', notaExistente.emitente_razao_social);
        
        // Dados do destinatário
        setValue('destinatarioCNPJ', notaExistente.destinatario_cnpj);
        setValue('destinatarioRazaoSocial', notaExistente.destinatario_razao_social);
        
        toast({
          title: "Nota fiscal encontrada",
          description: "A nota fiscal foi encontrada no banco de dados e os dados foram carregados.",
        });
      } else {
        // Se não encontrou no banco, usar a busca externa (mock)
        const notaFiscalData = await searchNotaFiscalByChave(chaveNF);
        
        // Fill form fields with found data
        Object.entries(notaFiscalData).forEach(([field, value]) => {
          setValue(field, value);
        });
        
        toast({
          title: "Nota fiscal encontrada",
          description: "A nota fiscal foi encontrada externamente e os dados foram carregados.",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar nota fiscal:", error);
      toast({
        title: "Erro",
        description: "Nota fiscal não encontrada ou erro ao buscar.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleKeySearch, isLoading };
};
