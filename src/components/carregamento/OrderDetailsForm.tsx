
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { FileText, Search } from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';

export interface OrdemCarregamento {
  id: string;
  cliente: string;
  destinatario: string;
  dataCarregamento: string;
  volumesTotal: number;
  volumesVerificados: number;
  status: 'pending' | 'processing' | 'completed';
}

interface OrderDetailsFormProps {
  onSubmit: (data: any) => void;
  ordemSelecionada: OrdemCarregamento | null;
}

const OrderDetailsForm: React.FC<OrderDetailsFormProps> = ({ onSubmit, ordemSelecionada }) => {
  const form = useForm();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <FileText className="mr-2 text-cross-blue" size={20} />
          Ordem de Carregamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <FormField
                control={form.control}
                name="numeroOC"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número da OC</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input placeholder="Digite o número da OC" {...field} />
                      </FormControl>
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" className="w-full bg-cross-blue hover:bg-cross-blue/90">
              Buscar
            </Button>
          </form>
        </Form>
        
        {ordemSelecionada && (
          <div className="mt-4 border rounded-md p-4">
            <h3 className="font-medium mb-2">Detalhes da Ordem</h3>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">OC:</dt>
                <dd>{ordemSelecionada.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Cliente:</dt>
                <dd>{ordemSelecionada.cliente}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Destinatário:</dt>
                <dd>{ordemSelecionada.destinatario}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Data:</dt>
                <dd>{ordemSelecionada.dataCarregamento}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Volumes:</dt>
                <dd>{ordemSelecionada.volumesVerificados} / {ordemSelecionada.volumesTotal}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Status:</dt>
                <dd>
                  <StatusBadge 
                    status={
                      ordemSelecionada.status === 'pending' ? 'warning' : 
                      ordemSelecionada.status === 'processing' ? 'info' : 'success'
                    } 
                    text={
                      ordemSelecionada.status === 'pending' ? 'Pendente' : 
                      ordemSelecionada.status === 'processing' ? 'Em Conferência' : 'Concluído'
                    } 
                  />
                </dd>
              </div>
            </dl>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderDetailsForm;
