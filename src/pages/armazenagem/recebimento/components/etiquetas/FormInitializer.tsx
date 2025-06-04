
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface FormInitializerProps {
  form: UseFormReturn<any>;
  notaFiscalData: any;
  onInitialized?: () => void;
}

const FormInitializer: React.FC<FormInitializerProps> = ({ form, notaFiscalData, onInitialized }) => {
  useEffect(() => {
    // If nota fiscal data is provided, pre-fill the form
    if (notaFiscalData?.notaFiscal) {
      // Log all received data for debugging
      console.log("Nota fiscal data received:", notaFiscalData);
      
      // Set all the available data from the nota fiscal
      form.setValue('notaFiscal', notaFiscalData.notaFiscal);
      
      // Set volumes total - check all possible field names
      if (notaFiscalData.volumesTotal) {
        console.log("Setting volumesTotal from notaFiscalData.volumesTotal:", notaFiscalData.volumesTotal);
        form.setValue('volumesTotal', String(notaFiscalData.volumesTotal).trim());
      } else if (notaFiscalData.volumesTotais) {
        console.log("Setting volumesTotal from notaFiscalData.volumesTotais:", notaFiscalData.volumesTotais);
        form.setValue('volumesTotal', String(notaFiscalData.volumesTotais).trim());
      } else if (notaFiscalData.quantidade_volumes) {
        console.log("Setting volumesTotal from notaFiscalData.quantidade_volumes:", notaFiscalData.quantidade_volumes);
        form.setValue('volumesTotal', String(notaFiscalData.quantidade_volumes).trim());
      }
      
      // Set peso total
      form.setValue('pesoTotalBruto', notaFiscalData.pesoTotal || '');
      
      // If volumes total is provided, automatically generate volumes
      const volumeCount = notaFiscalData.volumesTotal || notaFiscalData.volumesTotais || notaFiscalData.quantidade_volumes;
      if (volumeCount && parseInt(String(volumeCount)) > 0) {
        setTimeout(() => {
          if (onInitialized) onInitialized();
        }, 300);
      }
    }
  }, [notaFiscalData, form, onInitialized]);
  
  return null; // This component doesn't render anything
};

export default FormInitializer;
