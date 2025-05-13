
import React from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { generateDocumentNumber } from '../../../utils/documentUtils';
import DatePickerField from '../form/DatePickerField';
import DateTimePickerField from '../form/DateTimePickerField';
import DocumentTypeField from '../form/DocumentTypeField';

// Schema de validação do documento
const documentSchema = z.object({
  documentNumber: z.string().min(1, "Número do documento é obrigatório"),
  documentType: z.string().min(1, "Tipo de documento é obrigatório"),
  departureDateTime: z.date({
    required_error: "Data/hora de saída é obrigatória",
  }),
  arrivalDateTime: z.date({
    required_error: "Data/hora de chegada é obrigatória",
  }),
  driverName: z.string().min(1, "Nome do motorista é obrigatório"),
  truckId: z.string().min(1, "Identificação do cavalo é obrigatória"),
  trailer1: z.string().optional(),
  trailer2: z.string().optional(),
  trailerType: z.string().min(1, "Tipo de carroceria é obrigatório"),
  issuerUser: z.string().min(1, "Usuário emissor é obrigatório"),
  checkerUser: z.string().min(1, "Usuário conferente é obrigatório"),
  transporterName: z.string().min(1, "Nome da transportadora é obrigatória"),
  transporterLogo: z.string().optional(),
});

export type DocumentInfo = z.infer<typeof documentSchema>;

interface DocumentInfoFormProps {
  onSubmit: (data: DocumentInfo) => void;
  onCancel: () => void;
  defaultSequence?: number;
}

const DocumentInfoForm: React.FC<DocumentInfoFormProps> = ({ 
  onSubmit, 
  onCancel,
  defaultSequence = 1
}) => {
  const form = useForm<DocumentInfo>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      documentNumber: generateDocumentNumber(new Date(), defaultSequence),
      documentType: "outbound",
      departureDateTime: new Date(),
      arrivalDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // +1 dia
      driverName: "",
      truckId: "",
      trailer1: "",
      trailer2: "",
      trailerType: "",
      issuerUser: "Usuário Atual",
      checkerUser: "",
      transporterName: "",
      transporterLogo: "",
    },
  });

  const handleFormSubmit = (data: DocumentInfo) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="documentNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número do documento</FormLabel>
                <FormControl>
                  <Input {...field} readOnly className="bg-muted" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <DocumentTypeField
            form={form}
            name="documentType"
            label="Tipo de documento"
          />

          <DateTimePickerField
            form={form}
            name="departureDateTime"
            label="Previsão de saída"
          />
          
          <DateTimePickerField
            form={form}
            name="arrivalDateTime"
            label="Previsão de chegada"
          />
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">Dados do motorista</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="driverName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do motorista</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="truckId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cavalo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trailer1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carreta 1</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trailer2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carreta 2</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Opcional" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trailerType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de carroceria</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Aberta, Sider, etc" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">Dados da operação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="issuerUser"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuário emissor</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="checkerUser"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuário conferente</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transporterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transportadora</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transporterLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do logo da transportadora</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Opcional" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Gerar documento
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DocumentInfoForm;
