
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
      
      // Check for volumesTotal in different possible field names and set it
      if (notaFiscalData.volumesTotal) {
        console.log("Setting volumesTotal from notaFiscalData.volumesTotal:", notaFiscalData.volumesTotal);
        // Ensure volumesTotal is a string and assign it to the form
        form.setValue('volumesTotal', String(notaFiscalData.volumesTotal).trim());
      } else if (notaFiscalData.volumesTotais) {
        console.log("Setting volumesTotal from notaFiscalData.volumesTotais:", notaFiscalData.volumesTotais);
        // Ensure volumesTotais is a string and assign it to the form
        form.setValue('volumesTotal', String(notaFiscalData.volumesTotais).trim());
      }
      
      // Set peso total
      form.setValue('pesoTotalBruto', notaFiscalData.pesoTotal || '');
      
      // If volumes total is provided, automatically generate volumes
      if ((notaFiscalData.volumesTotal || notaFiscalData.volumesTotais) && 
          parseInt(notaFiscalData.volumesTotal || notaFiscalData.volumesTotais) > 0) {
        setTimeout(() => {
          if (onInitialized) onInitialized();
        }, 300);
      }
    }
  }, [notaFiscalData, form, onInitialized]);
  
  return null; // This component doesn't render anything
};

export default FormInitializer;
