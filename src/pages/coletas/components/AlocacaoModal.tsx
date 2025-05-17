
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Carga } from '../types/coleta.types';
import { Tag } from 'lucide-react';

interface AlocacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  cargasIds: string[];
  cargas: Carga[];
  onAlocar: (motoristaId: string, motoristaName: string, veiculoId: string, veiculoName: string) => void;
}

interface Motorista {
  id: string;
  nome: string;
}

interface Veiculo {
  id: string;
  placa: string;
  modelo: string;
}

// Mock data para motoristas e veículos
const motoristas: Motorista[] = [
  { id: 'mot-001', nome: 'José da Silva' },
  { id: 'mot-002', nome: 'Carlos Santos' },
  { id: 'mot-003', nome: 'Pedro Oliveira' },
  { id: 'mot-004', nome: 'Antônio Ferreira' },
  { id: 'mot-005', nome: 'Manuel Costa' },
];

const veiculos: Veiculo[] = [
  { id: 'veic-001', placa: 'ABC-1234', modelo: 'Fiorino' },
  { id: 'veic-002', placa: 'DEF-5678', modelo: 'Van' },
  { id: 'veic-003', placa: 'GHI-9012', modelo: 'Caminhão 3/4' },
  { id: 'veic-004', placa: 'JKL-3456', modelo: 'Caminhão Baú' },
];

const AlocacaoModal: React.FC<AlocacaoModalProps> = ({
  isOpen,
  onClose,
  cargasIds,
  cargas,
  onAlocar
}) => {
  const [selectedMotorista, setSelectedMotorista] = useState<string>('');
  const [selectedVeiculo, setSelectedVeiculo] = useState<string>('');

  const handleSubmit = () => {
    if (!selectedMotorista || !selectedVeiculo) return;

    const motorista = motoristas.find(m => m.id === selectedMotorista);
    const veiculo = veiculos.find(v => v.id === selectedVeiculo);
    
    if (motorista && veiculo) {
      const veiculoNome = `${veiculo.modelo} - ${veiculo.placa}`;
      onAlocar(selectedMotorista, motorista.nome, selectedVeiculo, veiculoNome);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Tag className="mr-2 h-5 w-5" />
            Alocar {cargasIds.length} Coleta{cargasIds.length !== 1 ? 's' : ''}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1.5">Coletas selecionadas:</h3>
              <div className="text-sm bg-muted/50 p-2 rounded-md max-h-[100px] overflow-y-auto">
                {cargas.map(carga => (
                  <div key={carga.id} className="mb-1 last:mb-0">
                    {carga.id} - {carga.destino} ({carga.volumes} vol., {carga.peso})
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label htmlFor="motorista" className="text-sm font-medium">
                  Motorista
                </label>
                <Select 
                  value={selectedMotorista} 
                  onValueChange={setSelectedMotorista}
                >
                  <SelectTrigger id="motorista">
                    <SelectValue placeholder="Selecione um motorista" />
                  </SelectTrigger>
                  <SelectContent>
                    {motoristas.map(motorista => (
                      <SelectItem key={motorista.id} value={motorista.id}>
                        {motorista.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="veiculo" className="text-sm font-medium">
                  Veículo
                </label>
                <Select 
                  value={selectedVeiculo} 
                  onValueChange={setSelectedVeiculo}
                >
                  <SelectTrigger id="veiculo">
                    <SelectValue placeholder="Selecione um veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {veiculos.map(veiculo => (
                      <SelectItem key={veiculo.id} value={veiculo.id}>
                        {veiculo.modelo} - {veiculo.placa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedMotorista || !selectedVeiculo}
          >
            Alocar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlocacaoModal;
