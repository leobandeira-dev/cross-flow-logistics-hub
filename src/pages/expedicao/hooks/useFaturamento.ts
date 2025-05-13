
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { NotaFiscal } from '../Faturamento';

export const useFaturamento = () => {
  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [activeTab, setActiveTab] = useState("notas");

  const calculateFreight = (notasToCalculate: NotaFiscal[]): NotaFiscal[] => {
    // Calculate total real weight
    const pesoTotalReal = notasToCalculate.reduce((sum, nota) => sum + nota.pesoNota, 0);
    
    // Determine if we need to use minimum weight
    const usarPesoMinimo = pesoTotalReal < notasToCalculate[0].pesoMinimo;
    const pesoConsiderado = usarPesoMinimo ? notasToCalculate[0].pesoMinimo : pesoTotalReal;
    
    // Calculate freight for each note
    return notasToCalculate.map(nota => {
      // Calculate weight-based freight
      const proporcaoPeso = usarPesoMinimo 
        ? nota.pesoNota / pesoTotalReal 
        : 1;
      
      const fretePeso = (nota.fretePorTonelada / 1000) * nota.pesoNota * proporcaoPeso;
      
      // Calculate express value
      const valorExpresso = fretePeso * (nota.aliquotaExpresso / 100);
      
      // Calcular valores adicionais (se existirem)
      const paletizacao = nota.paletizacao || 0;
      const pedagio = nota.pedagio || 0;
      
      // Calculate ICMS value
      const valorBaseIcms = fretePeso + valorExpresso + paletizacao + pedagio;
      const icms = nota.aliquotaICMS ? valorBaseIcms * (nota.aliquotaICMS / 100) : 0;
      
      // Calculate total freight to be allocated
      const freteRatear = fretePeso + valorExpresso;
      
      // Calcular o total da prestação
      const totalPrestacao = fretePeso + paletizacao + pedagio + icms;
      
      return {
        ...nota,
        fretePeso,
        valorExpresso,
        freteRatear,
        totalPrestacao
      };
    });
  };

  const handleAddNotaFiscal = (nota: Omit<NotaFiscal, 'id' | 'fretePeso' | 'valorExpresso' | 'freteRatear'>) => {
    const newNota: NotaFiscal = {
      ...nota,
      id: `NF-${Math.random().toString(36).substr(2, 9)}`
    };
    
    const updatedNotas = [...notas, newNota];
    
    // If there are notes, calculate freight
    if (updatedNotas.length > 0) {
      const notasCalculated = calculateFreight(updatedNotas);
      setNotas(notasCalculated);
      
      toast({
        title: "Nota fiscal adicionada com sucesso",
        description: `Nota para ${nota.cliente} em ${format(nota.data, 'dd/MM/yyyy')} adicionada.`
      });
    }
  };

  const handleDeleteNotaFiscal = (id: string) => {
    const updatedNotas = notas.filter(nota => nota.id !== id);
    
    // If there are still notes, recalculate
    if (updatedNotas.length > 0) {
      const notasCalculated = calculateFreight(updatedNotas);
      setNotas(notasCalculated);
    } else {
      setNotas([]);
    }
    
    toast({
      title: "Nota fiscal removida",
      description: "A nota fiscal foi removida com sucesso."
    });
  };

  const handleRecalculate = () => {
    if (notas.length > 0) {
      const notasCalculated = calculateFreight([...notas]);
      setNotas(notasCalculated);
      
      toast({
        title: "Frete recalculado",
        description: "Valores de frete foram recalculados com sucesso."
      });
    }
  };

  const handleImportarLote = (notasLote: Omit<NotaFiscal, 'id' | 'fretePeso' | 'valorExpresso' | 'freteRatear'>[]) => {
    if (notasLote.length === 0) return;
    
    // Generate IDs for new notes
    const notasComId = notasLote.map(nota => ({
      ...nota,
      id: `NF-${Math.random().toString(36).substr(2, 9)}`
    }));
    
    // Combine with existing notes
    const updatedNotas = [...notas, ...notasComId];
    
    // Calculate freight
    const notasCalculated = calculateFreight(updatedNotas);
    setNotas(notasCalculated);
    
    toast({
      title: "Notas fiscais importadas com sucesso",
      description: `${notasLote.length} notas fiscais foram adicionadas ao sistema.`
    });
    
    // Switch to notes tab to show the imported items
    setActiveTab("notas");
  };

  const handleExportToPDF = () => {
    toast({
      title: "Exportando para PDF",
      description: "Esta funcionalidade será implementada em breve."
    });
  };

  return {
    notas,
    activeTab,
    setActiveTab,
    handleAddNotaFiscal,
    handleDeleteNotaFiscal,
    handleRecalculate,
    handleImportarLote,
    handleExportToPDF,
  };
};
