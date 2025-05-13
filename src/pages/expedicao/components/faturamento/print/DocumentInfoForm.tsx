import React from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DatePickerField from '../form/DatePickerField';

export interface DocumentInfoValues {
  numeroDocumento: string;
  tipoDocumento: string;
  previsaoSaida: Date;
  previsaoSaida_hora: string;
  previsaoChegada: Date;
  previsaoChegada_hora: string;
  motoristaNome: string;
  veiculoCavalo: string;
  veiculoCarreta1: string;
  veiculoCarreta2: string;
  tipoCarroceria: string;
  usuarioEmissor: string;
  usuarioConferente: string;
  transportadora: string;
}

interface DocumentInfoFormProps {
  onSubmit: (data: DocumentInfoValues) => void;
  initialValues?: Partial<DocumentInfoValues>;
  isSubmitting?: boolean;
}

const DocumentInfoForm: React.FC<DocumentInfoFormProps> = ({ 
  onSubmit, 
  initialValues = {}, 
  isSubmitting = false 
}) => {
  const form = useForm<DocumentInfoValues>({
    defaultValues: {
      numeroDocumento: '',
      tipoDocumento: 'Outbound',
      previsaoSaida: new Date(),
      previsaoSaida_hora: '08:00',
      previsaoChegada: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
      previsaoChegada_hora: '17:00',
      motoristaNome: '',
      veiculoCavalo: '',
      veiculoCarreta1: '',
      veiculoCarreta2: '',
      tipoCarroceria: '',
      usuarioEmissor: '',
      usuarioConferente: '',
      transportadora: '',
      ...initialValues
    }
  });

  const handleFormSubmit = (data: DocumentInfoValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="numeroDocumento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número do Documento</FormLabel>
                <FormControl>
                  <Input placeholder="DDMMAA-X" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tipoDocumento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Documento</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Inbound">Inbound</SelectItem>
                    <SelectItem value="Outbound">Outbound</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="transportadora"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transportadora</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da transportadora" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePickerField
              form={form}
              name="previsaoSaida"
              label="Previsão de Saída (Data)"
            />
            <FormField
              control={form.control}
              name="previsaoSaida_hora"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora de Saída</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePickerField
              form={form}
              name="previsaoChegada"
              label="Previsão de Chegada (Data)"
            />
            <FormField
              control={form.control}
              name="previsaoChegada_hora"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora de Chegada</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="motoristaNome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Motorista</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tipoCarroceria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Carroceria</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Aberta">Aberta</SelectItem>
                    <SelectItem value="Sider">Sider</SelectItem>
                    <SelectItem value="Baú">Baú</SelectItem>
                    <SelectItem value="Refrigerada">Refrigerada</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="veiculoCavalo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cavalo (Placa)</FormLabel>
                <FormControl>
                  <Input placeholder="AAA-0000" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="veiculoCarreta1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carreta 1 (Placa)</FormLabel>
                <FormControl>
                  <Input placeholder="AAA-0000" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="veiculoCarreta2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carreta 2 (Placa)</FormLabel>
                <FormControl>
                  <Input placeholder="AAA-0000" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="usuarioEmissor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuário Emissor</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do emissor" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="usuarioConferente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuário Conferente</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do conferente" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Limpar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar e Continuar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DocumentInfoForm;
