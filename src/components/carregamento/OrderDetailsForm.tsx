
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { FileText, Search, Truck } from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';
import { toast } from '@/hooks/use-toast';

export interface OrdemCarregamento {
  id: string;
  cliente: string;
  destinatario: string;
  dataCarregamento: string;
  volumesTotal: number;
  volumesVerificados: number;
  status: 'pending' | 'processing' | 'completed';
  notasFiscais?: NotaFiscal[];
}

export interface NotaFiscal {
  id: string;
  numero: string;
  remetente: string;
  cliente: string;
  pedido?: string;
  dataEmissao: string;
  valor: number;
  pesoBruto: number;
}

interface OrderDetailsFormProps {
  onSubmit: (data: any) => void;
  ordemSelecionada: OrdemCarregamento | null;
  onImportInvoices?: (notas: NotaFiscal[]) => void;
  showImportButton?: boolean;
}

const OrderDetailsForm: React.FC<OrderDetailsFormProps> = ({ 
  onSubmit, 
  ordemSelecionada,
  onImportInvoices,
  showImportButton = false 
}) => {
  const form = useForm();
  const [loading, setLoading] = useState(false);

  const handleImportInvoices = () => {
    if (!ordemSelecionada || !onImportInvoices) return;
    
    setLoading(true);
    
    // Simulate API call to get invoices data
    setTimeout(() => {
      // Mock invoices data based on the selected order
      const mockInvoices: NotaFiscal[] = [
        {
          id: `NF-${Math.random().toString(36).substr(2, 9)}`,
          numero: `NF-${Math.floor(Math.random() * 10000)}`,
          remetente: "Empresa XYZ",
          cliente: ordemSelecionada.cliente,
          pedido: `PED-${Math.floor(Math.random() * 5000)}`,
          dataEmissao: new Date().toISOString().split('T')[0],
          valor: Math.floor(Math.random() * 10000) / 100,
          pesoBruto: Math.floor(Math.random() * 1000) / 10
        },
        {
          id: `NF-${Math.random().toString(36).substr(2, 9)}`,
          numero: `NF-${Math.floor(Math.random() * 10000)}`,
          remetente: "Empresa ABC",
          cliente: ordemSelecionada.cliente,
          pedido: `PED-${Math.floor(Math.random() * 5000)}`,
          dataEmissao: new Date().toISOString().split('T')[0],
          valor: Math.floor(Math.random() * 20000) / 100,
          pesoBruto: Math.floor(Math.random() * 1500) / 10
        }
      ];
      
      onImportInvoices(mockInvoices);
      
      toast({
        title: "Notas fiscais importadas",
        description: `${mockInvoices.length} notas fiscais foram importadas da OC ${ordemSelecionada.id}.`
      });
      
      setLoading(false);
    }, 1500);
  };

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
            
            <div>
              <FormField
                control={form.control}
                name="tipoVeiculo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Veículo</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2"
                        {...field}
                      >
                        <option value="">Todos</option>
                        <option value="truck">Caminhão</option>
                        <option value="van">Van</option>
                        <option value="car">Carro</option>
                      </select>
                    </FormControl>
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
            
            {showImportButton && onImportInvoices && (
              <div className="mt-4">
                <Button 
                  onClick={handleImportInvoices} 
                  className="w-full"
                  disabled={loading}
                >
                  <Truck size={16} className="mr-2" />
                  {loading ? "Importando..." : "Importar Notas Fiscais para Faturamento"}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderDetailsForm;
