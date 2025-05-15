
import { useState } from "react";
import { useOrdemCarregamentoCreate } from "./useOrdemCarregamentoCreate";
import { useNotasFiscais } from "./useNotasFiscais";
import { useOrdensCarregamentoQuery } from "./useOrdensCarregamentoQuery";
import { NotaFiscal, OrdemCarregamento } from "./types";

export type { NotaFiscal, OrdemCarregamento } from "./types";

export const useOrdemCarregamento = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    ordensCarregamento,
    setOrdensCarregamento,
    fetchOrdensCarregamento,
    iniciarCarregamento
  } = useOrdensCarregamentoQuery();
  
  const { createOrdemCarregamento } = useOrdemCarregamentoCreate();
  
  const {
    notasFiscaisDisponiveis,
    fetchNotasFiscaisDisponiveis,
    importarNotasFiscais
  } = useNotasFiscais(setOrdensCarregamento);

  // Combine loading states from all hooks
  const combinedIsLoading = isLoading;

  return {
    isLoading: combinedIsLoading,
    ordensCarregamento,
    notasFiscaisDisponiveis,
    createOrdemCarregamento,
    fetchNotasFiscaisDisponiveis,
    importarNotasFiscais,
    fetchOrdensCarregamento,
    iniciarCarregamento
  };
};
