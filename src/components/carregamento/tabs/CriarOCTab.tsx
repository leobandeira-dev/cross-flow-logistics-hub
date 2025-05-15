
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { FileText, Calendar, Search, Truck } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { useOrdemCarregamento } from '@/hooks/carregamento/useOrdemCarregamento';
import { useNavigate } from 'react-router-dom';

const CriarOCTab: React.FC = () => {
  const [addingItems, setAddingItems] = useState(false);
  const { createOrdemCarregamento, isLoading } = useOrdemCarregamento();
  const navigate = useNavigate();
  
  const form = useForm({
    defaultValues: {
      cliente: '',
      tipoCarregamento: '',
      dataCarregamento: '',
      transportadora: '',
      placaVeiculo: '',
      motorista: '',
      observacoes: ''
    }
  });
  
  const handleSubmit = async (data: any) => {
    const result = await createOrdemCarregamento(data);
    if (result) {
      form.reset();
      // Navigate to consultar tab after creating
      navigate('/armazenagem/carregamento/ordem?tab=consultar');
    }
  };

  const handleAddItems = () => {
    setAddingItems(true);
    toast({
      title: "Adicionar itens",
      description: "Por favor, primeiro crie a ordem de carregamento para adicionar itens."
    });
    setTimeout(() => setAddingItems(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <FileText className="mr-2 text-cross-blue" size={20} />
          Nova Ordem de Carregamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="cliente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input placeholder="Buscar cliente..." {...field} />
                      </FormControl>
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tipoCarregamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Carregamento</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2"
                        {...field}
                      >
                        <option value="">Selecione</option>
                        <option value="entrega">Entrega</option>
                        <option value="transferencia">Transferência</option>
                        <option value="devolucao">Devolução</option>
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dataCarregamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Carregamento</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="transportadora"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transportadora</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input placeholder="Buscar transportadora..." {...field} />
                      </FormControl>
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="placaVeiculo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placa do Veículo</FormLabel>
                    <FormControl>
                      <Input placeholder="AAA-0000" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="motorista"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motorista</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do motorista" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <textarea 
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Observações sobre o carregamento..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Card className="border-dashed">
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="font-medium mb-2">Selecionar Itens para Carregamento</h3>
                  <p className="text-sm text-gray-500 mb-4">Adicione itens a serem carregados para esta OC</p>
                  <Button 
                    className="bg-cross-blue hover:bg-cross-blue/90"
                    onClick={handleAddItems}
                    disabled={addingItems || isLoading}
                  >
                    {addingItems ? "Adicionando..." : "Adicionar Itens"}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => form.reset()}>Cancelar</Button>
              <Button 
                type="submit" 
                className="bg-cross-blue hover:bg-cross-blue/90"
                disabled={isLoading}
              >
                {isLoading ? "Criando..." : "Criar Ordem de Carregamento"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CriarOCTab;
