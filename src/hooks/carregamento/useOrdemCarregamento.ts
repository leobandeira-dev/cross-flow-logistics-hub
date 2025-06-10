
import { useState } from "react";
import { useOrdemCarregamentoReal } from "./useOrdemCarregamentoReal";
import { NotaFiscal, OrdemCarregamento } from "./types";

// Re-exportar os tipos
export type { NotaFiscal, OrdemCarregamento } from "./types";

export const useOrdemCarregamento = () => {
  // Usar a versão real em vez da mock
  const {
    isLoading,
    ordensCarregamento,
    notasFiscaisDisponiveis,
    fetchOrdensCarregamento,
    fetchNotasFiscaisDisponiveis,
    createOrdemCarregamento,
    importarNotasFiscais,
    buscarOrdemPorNumero,
    contarVolumesOrdem,
    buscarNotasFiscaisVinculadas,
    buscarVolumesVinculados
  } = useOrdemCarregamentoReal();

  return {
    isLoading,
    ordensCarregamento,
    notasFiscaisDisponiveis,
    createOrdemCarregamento,
    fetchNotasFiscaisDisponiveis,
    importarNotasFiscais,
    fetchOrdensCarregamento,
    buscarOrdemPorNumero,
    contarVolumesOrdem,
    buscarNotasFiscaisVinculadas,
    buscarVolumesVinculados
  };
};
