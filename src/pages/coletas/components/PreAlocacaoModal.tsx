
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Carga } from '../types/coleta.types';
import { toast } from '@/hooks/use-toast';
import { Truck } from 'lucide-react';

// Schema para validação do formulário
const preAlocacaoSchema = z.object({
  tipoVeiculoId: z.string({ required_error: 'Selecione um tipo de veículo' }),
});

type PreAlocacaoFormData = z.infer<typeof preAlocacaoSchema>;

// Dados mockados de tipos de veículos
const tiposVeiculosData = [
  { id: 'tv1', nome: 'Fiorino', capacidade: '650kg' },
  { id: 'tv2', nome: 'Van', capacidade: '1.5t' },
  { id: 'tv3', nome: 'HR', capacidade: '3.5t' },
  { id: 'tv4', nome: 'Baú 3/4', capacidade: '4t' },
  { id: 'tv5', nome: 'Truck', capacidade: '9t' },
  { id: 'tv6', nome: 'Carreta', capacidade: '27t' },
];

export interface PreAlocacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  cargas: Carga[];
  onPreAlocar: (cargasIds: string[], tipoVeiculoId: string, tipoVeiculoNome: string) => void;
}

const PreAlocacaoModal: React.FC<PreAlocacaoModalProps> = ({
  isOpen,
  onClose,
  cargas,
  onPreAlocar
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<PreAlocacaoFormData>({
    resolver: zodResolver(preAlocacaoSchema),
    defaultValues: {
      tipoVeiculoId: '',
    },
  });

  const handleSubmit = (data: PreAlocacaoFormData) => {
    setIsLoading(true);
    
    // Encontrar o tipo de veículo selecionado
    const tipoVeiculo = tiposVeiculosData.find(tv => tv.id === data.tipoVeiculoId);
    
    if (!tipoVeiculo) {
      setIsLoading(false);
      return;
    }
    
    // Chamar a callback de pré-alocação
    onPreAlocar(
      cargas.map(carga => carga.id),
      tipoVeiculo.id,
      `${tipoVeiculo.nome} (${tipoVeiculo.capacidade})`
    );
    
    // Reset do formulário e fechamento do modal
    form.reset();
    setIsLoading(false);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Truck className="mr-2 h-5 w-5" />
            Pré-Alocação de Veículo
          </DialogTitle>
          <DialogDescription>
            Defina o tipo de veículo necessário para esta carga antes de alocar um motorista específico.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">
                {cargas.length} carga{cargas.length !== 1 ? 's' : ''} selecionada{cargas.length !== 1 ? 's' : ''}
              </p>
              <ul className="text-sm">
                {cargas.slice(0, 3).map((carga) => (
                  <li key={carga.id} className="mb-1">• {carga.id}: {carga.destino} ({carga.peso})</li>
                ))}
                {cargas.length > 3 && (
                  <li className="text-muted-foreground">• E mais {cargas.length - 3} carga(s)...</li>
                )}
              </ul>
            </div>
            
            <FormField
              control={form.control}
              name="tipoVeiculoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Veículo</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tipo de veículo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tiposVeiculosData.map((tipoVeiculo) => (
                        <SelectItem key={tipoVeiculo.id} value={tipoVeiculo.id}>
                          {tipoVeiculo.nome} ({tipoVeiculo.capacidade})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Processando...' : 'Confirmar Pré-Alocação'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PreAlocacaoModal;
