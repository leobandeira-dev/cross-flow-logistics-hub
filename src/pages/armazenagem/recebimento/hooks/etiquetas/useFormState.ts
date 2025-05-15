
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

/**
 * Hook for managing form state in the etiquetas generation
 */
export const useFormState = () => {
  const location = useLocation();
  const notaFiscalData = location.state || {};
  const [tipoEtiqueta, setTipoEtiqueta] = useState<'volume' | 'mae'>('volume');

  // Initialize form with default values
  const form = useForm({
    defaultValues: {
      notaFiscal: '',
      tipoEtiqueta: 'volume',
      volumesTotal: '',
      formatoImpressao: '50x100',
      layoutStyle: 'standard',
      tipoVolume: 'geral',
      codigoONU: '',
      codigoRisco: '',
      etiquetaMaeId: '',
      tipoEtiquetaMae: 'geral',
      descricaoEtiquetaMae: '',
      pesoTotalBruto: ''
    }
  });

  return {
    form,
    notaFiscalData,
    tipoEtiqueta,
    setTipoEtiqueta
  };
};
