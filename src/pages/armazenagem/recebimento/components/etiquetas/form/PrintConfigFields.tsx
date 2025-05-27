
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';

interface PrintConfigFieldsProps {
  form: UseFormReturn<any>;
}

const PrintConfigFields: React.FC<PrintConfigFieldsProps> = ({ form }) => {
  const { watch } = form;

  return (
    <>
      <div>
        <Label htmlFor="formatoImpressao">Formato de Impressão</Label>
        <Select 
          defaultValue="50x100"
          onValueChange={(value) => form.setValue('formatoImpressao', value)}
          value={watch('formatoImpressao')}
        >
          <SelectTrigger id="formatoImpressao">
            <SelectValue placeholder="Selecione um formato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="50x100">Etiqueta 50x100mm</SelectItem>
            <SelectItem value="a4">Folha A4</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="layoutStyle">Layout da Etiqueta</Label>
        <Select 
          defaultValue="standard"
          onValueChange={(value) => form.setValue('layoutStyle', value)}
          value={watch('layoutStyle', 'standard')}
        >
          <SelectTrigger id="layoutStyle">
            <SelectValue placeholder="Selecione um layout" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Padrão (Sedex)</SelectItem>
            <SelectItem value="enhanced">Alta Legibilidade (Texto Grande)</SelectItem>
            <SelectItem value="compact">Compacto (Braspress)</SelectItem>
            <SelectItem value="modern">Moderno (Jadlog/UPS)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default PrintConfigFields;
