
import React, { useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface FormInitializerProps {
  form: UseFormReturn<any>;
  notaFiscalData: any;
  onInitialized?: () => void;
}

const FormInitializer: React.FC<FormInitializerProps> = ({ 
  form, 
  notaFiscalData, 
  onInitialized 
}) => {
  const initializedRef = useRef(false);

  useEffect(() => {
    // Evitar inicialização múltipla
    if (initializedRef.current || !notaFiscalData || Object.keys(notaFiscalData).length === 0) {
      return;
    }

    console.log('Nota fiscal data received:', notaFiscalData);

    // Marcar como inicializado primeiro para evitar loops
    initializedRef.current = true;

    // Definir valores do formulário
    if (notaFiscalData.notaFiscal) {
      form.setValue('numeroNotaFiscal', notaFiscalData.notaFiscal);
    }
    
    if (notaFiscalData.volumesTotal) {
      console.log('Setting volumesTotal from notaFiscalData.volumesTotal:', notaFiscalData.volumesTotal);
      form.setValue('quantidadeVolumes', notaFiscalData.volumesTotal);
    }
    
    if (notaFiscalData.numeroPedido) {
      form.setValue('numeroPedido', notaFiscalData.numeroPedido);
    }
    
    if (notaFiscalData.remetente) {
      form.setValue('remetente', notaFiscalData.remetente);
    }
    
    if (notaFiscalData.destinatario) {
      form.setValue('destinatario', notaFiscalData.destinatario);
    }
    
    if (notaFiscalData.endereco) {
      form.setValue('endereco', notaFiscalData.endereco);
    }
    
    if (notaFiscalData.cidade) {
      form.setValue('cidade', notaFiscalData.cidade);
    }
    
    if (notaFiscalData.uf) {
      form.setValue('uf', notaFiscalData.uf);
    }
    
    if (notaFiscalData.chaveNF) {
      form.setValue('chaveNF', notaFiscalData.chaveNF);
    }
    
    if (notaFiscalData.pesoTotal) {
      form.setValue('pesoTotalBruto', notaFiscalData.pesoTotal);
    }

    // Executar callback apenas se fornecido
    if (onInitialized) {
      // Usar setTimeout para evitar problemas de timing
      setTimeout(() => {
        onInitialized();
      }, 100);
    }
  }, [form, notaFiscalData, onInitialized]);

  return null;
};

export default FormInitializer;
