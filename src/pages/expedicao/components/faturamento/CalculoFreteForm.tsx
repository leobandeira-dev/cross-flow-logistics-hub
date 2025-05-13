import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { PopoverContent, PopoverTrigger, Popover } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NotaFiscal } from '../../Faturamento';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';

// Schema for form validation
const formSchema = z.object({
  data: z.date({
    required_error: "A data é obrigatória.",
  }),
  cliente: z.string().min(2, {
    message: "O cliente precisa ter pelo menos 2 caracteres.",
  }),
  pesoNota: z.coerce.number().min(0.1, {
    message: "O peso da nota deve ser maior que 0.",
  }),
  fretePorTonelada: z.coerce.number().min(0.1, {
    message: "O frete por tonelada deve ser maior que 0.",
  }),
  pesoMinimo: z.coerce.number().min(0, {
    message: "O peso mínimo deve ser maior ou igual a 0.",
  }),
  aliquotaICMS: z.coerce.number().min(0).max(100, {
    message: "A alíquota de ICMS deve estar entre 0 e 100.",
  }),
  aliquotaExpresso: z.coerce.number().min(0).max(100, {
    message: "A alíquota de expresso deve estar entre 0 e 100.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface CalculoFreteFormProps {
  onAddNotaFiscal: (nota: Omit<NotaFiscal, 'id' | 'fretePeso' | 'valorExpresso' | 'freteRatear'>) => void;
  onComplete: () => void;
}

const CalculoFreteForm: React.FC<CalculoFreteFormProps> = ({ onAddNotaFiscal, onComplete }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data: new Date(),
      cliente: '',
      pesoNota: 0,
      fretePorTonelada: 0,
      pesoMinimo: 0,
      aliquotaICMS: 0,
      aliquotaExpresso: 0,
    },
  });

  const onSubmit = (formValues: FormValues) => {
    // Since the form is validated by zod, all values should be present and of the correct type
    const nota: Omit<NotaFiscal, 'id' | 'fretePeso' | 'valorExpresso' | 'freteRatear'> = {
      data: formValues.data,
      cliente: formValues.cliente,
      pesoNota: formValues.pesoNota,
      fretePorTonelada: formValues.fretePorTonelada,
      pesoMinimo: formValues.pesoMinimo,
      aliquotaICMS: formValues.aliquotaICMS,
      aliquotaExpresso: formValues.aliquotaExpresso,
    };
    
    onAddNotaFiscal(nota);
    form.reset({
      data: new Date(),
      cliente: '',
      pesoNota: 0,
      fretePorTonelada: 0,
      pesoMinimo: 0,
      aliquotaICMS: 0,
      aliquotaExpresso: 0,
    });
    onComplete();
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Data field */}
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cliente field */}
              <FormField
                control={form.control}
                name="cliente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do cliente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Peso Nota field */}
              <FormField
                control={form.control}
                name="pesoNota"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso Nota (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Frete por Tonelada field */}
              <FormField
                control={form.control}
                name="fretePorTonelada"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frete por Tonelada (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Peso Minimo field */}
              <FormField
                control={form.control}
                name="pesoMinimo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso Mínimo (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Aliquota ICMS field */}
              <FormField
                control={form.control}
                name="aliquotaICMS"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alíquota ICMS (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Aliquota Expresso field */}
              <FormField
                control={form.control}
                name="aliquotaExpresso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alíquota Expresso (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => form.reset()}>Limpar</Button>
              <Button type="submit">Adicionar Nota Fiscal</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CalculoFreteForm;
