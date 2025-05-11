
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';
import { NotaFiscalSchemaType } from './notaFiscalSchema';

const InformacoesAdicionais: React.FC = () => {
  const { control } = useFormContext<NotaFiscalSchemaType>();
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Informações Adicionais e Totais</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="valorTotal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Total</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="pesoTotalBruto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Peso Total Bruto</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="volumesTotal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Volumes Total</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField
            control={control}
            name="fobCif"
            render={({ field }) => (
              <FormItem>
                <FormLabel>FOB/CIF</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fob">FOB</SelectItem>
                    <SelectItem value="cif">CIF</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="numeroPedido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número do Pedido</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4 mt-4">
          <FormField
            control={control}
            name="informacoesComplementares"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Informações Complementares</FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default InformacoesAdicionais;
