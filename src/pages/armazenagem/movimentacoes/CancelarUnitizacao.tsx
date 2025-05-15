import React from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Package, Search, AlertCircle } from 'lucide-react';
import DataTable from '@/components/common/DataTable';

// Mock data
const paletesUnitizados = [
  { id: 'PAL-2023-001', volumes: 12, produtos: 'Diversos', dataUnitizacao: '12/05/2023', responsavel: 'João Silva' },
  { id: 'PAL-2023-002', volumes: 8, produtos: 'Eletrônicos', dataUnitizacao: '11/05/2023', responsavel: 'Maria Oliveira' },
  { id: 'PAL-2023-003', volumes: 15, produtos: 'Material de Escritório', dataUnitizacao: '10/05/2023', responsavel: 'Carlos Santos' },
];

const CancelarUnitizacao: React.FC = () => {
  const form = useForm();
  
  const handleSubmit = (data: any) => {
    console.log('Form data submitted:', data);
  };

  return (
    <MainLayout title="Cancelar Unitização">
      <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Cancelar Unitização</h2>
        <p className="text-gray-600">Desfaça unitizações e reorganize volumes</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Package className="mr-2 text-cross-blue" size={20} />
                Buscar Palete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <div>
                    <FormField
                      control={form.control}
                      name="idPalete"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID do Palete</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input placeholder="Digite o código do palete" {...field} />
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
              
              <div className="mt-6">
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <AlertCircle className="text-amber-500 mr-3 mt-0.5" size={18} />
                      <div>
                        <h4 className="font-medium text-amber-800 mb-1">Atenção</h4>
                        <p className="text-sm text-amber-700">
                          O cancelamento de unitização irá desvincular todos os volumes associados ao palete.
                          Esta ação não pode ser desfeita.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Paletes Unitizados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Input placeholder="Filtrar por ID ou responsável..." />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            
              <DataTable
                columns={[
                  { header: 'ID Palete', accessor: 'id' },
                  { header: 'Volumes', accessor: 'volumes' },
                  { header: 'Produtos', accessor: 'produtos' },
                  { header: 'Data Unitização', accessor: 'dataUnitizacao' },
                  { header: 'Responsável', accessor: 'responsavel' },
                  {
                    header: 'Ações',
                    accessor: 'actions', // Add this line
                    cell: () => (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Detalhes</Button>
                        <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                          Cancelar
                        </Button>
                      </div>
                    )
                  }
                ]}
                data={paletesUnitizados}
              />
              
              <div className="mt-4 p-4 border rounded-md bg-gray-50">
                <h3 className="font-medium mb-2">Informações do Cancelamento</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Ao cancelar uma unitização, os seguintes processos serão executados:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>1. Todos os volumes serão desvinculados do palete</li>
                  <li>2. Os volumes voltarão a estar disponíveis para nova unitização</li>
                  <li>3. O endereçamento do palete será liberado</li>
                  <li>4. Um registro de cancelamento será gerado no histórico</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default CancelarUnitizacao;
