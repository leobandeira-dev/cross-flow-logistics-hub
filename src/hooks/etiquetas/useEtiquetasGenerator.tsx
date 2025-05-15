
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Etiqueta } from '@/types/supabase.types';
import etiquetaService from '@/services/etiquetaService';
import { GenerationOptions, LayoutStyle } from './types';

export const useEtiquetasGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
  const [etiquetaMae, setEtiquetaMae] = useState<Etiqueta | null>(null);

  const generateEtiquetas = async (
    quantidade: number,
    notaFiscalId: string | null,
    options: GenerationOptions
  ) => {
    setIsGenerating(true);
    const novasEtiquetas: Etiqueta[] = [];
    
    try {
      for (let i = 0; i < quantidade; i++) {
        const etiquetaData: Partial<Etiqueta> = {
          tipo: options.tipo || 'volume',
          altura: options.altura,
          largura: options.largura,
          comprimento: options.comprimento,
          peso: options.peso,
          fragil: options.fragil,
          nota_fiscal_id: notaFiscalId || undefined
        };
        
        const etiqueta = await etiquetaService.criarEtiqueta(etiquetaData);
        novasEtiquetas.push(etiqueta);
      }
      
      setEtiquetas(novasEtiquetas);
      toast({
        title: "Etiquetas geradas com sucesso",
        description: `${quantidade} etiquetas foram geradas.`
      });
      
      return novasEtiquetas;
    } catch (error: any) {
      toast({
        title: "Erro ao gerar etiquetas",
        description: error.message,
        variant: "destructive"
      });
      return [];
    } finally {
      setIsGenerating(false);
    }
  };
  
  const generateEtiquetaMae = async (
    etiquetasFilhas: Etiqueta[],
    options: GenerationOptions
  ) => {
    setIsGenerating(true);
    
    try {
      if (etiquetasFilhas.length === 0) {
        throw new Error("É necessário selecionar pelo menos uma etiqueta filha");
      }
      
      const notaFiscalId = etiquetasFilhas[0]?.nota_fiscal_id;
      
      const etiquetaMaeData: Partial<Etiqueta> = {
        tipo: 'etiqueta_mae',
        altura: options.altura,
        largura: options.largura,
        comprimento: options.comprimento,
        peso: options.peso,
        fragil: options.fragil,
        nota_fiscal_id: notaFiscalId
      };
      
      const novaMae = await etiquetaService.criarEtiqueta(etiquetaMaeData);
      
      // Vincular etiquetas filhas
      for (const etiqueta of etiquetasFilhas) {
        await etiquetaService.vincularEtiquetaMae(etiqueta.id, novaMae.id);
      }
      
      setEtiquetaMae(novaMae);
      toast({
        title: "Etiqueta mãe gerada com sucesso",
        description: `Etiqueta mãe ${novaMae.codigo} vinculada a ${etiquetasFilhas.length} volumes.`
      });
      
      return novaMae;
    } catch (error: any) {
      toast({
        title: "Erro ao gerar etiqueta mãe",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    etiquetas,
    etiquetaMae,
    generateEtiquetas,
    generateEtiquetaMae,
    setEtiquetas,
    setEtiquetaMae
  };
};
