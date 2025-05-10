
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

// Mock de motoristas disponíveis
const motoristasDisponiveis = [
  { id: 1, nome: 'José da Silva' },
  { id: 2, nome: 'Carlos Santos' },
  { id: 3, nome: 'Pedro Oliveira' },
  { id: 4, nome: 'Antônio Ferreira' },
  { id: 5, nome: 'Manuel Costa' },
  { id: 6, nome: 'Roberto Almeida' },
];

// Mock de veículos disponíveis
const veiculosDisponiveis = [
  { placa: 'ABC-1234', tipo: 'Caminhão 3/4' },
  { placa: 'DEF-5678', tipo: 'Caminhão Toco' },
  { placa: 'GHI-9012', tipo: 'Caminhão Truck' },
  { placa: 'JKL-3456', tipo: 'Carreta Simples' },
  { placa: 'MNO-7890', tipo: 'Carreta Eixo Estendido' },
  { placa: 'PQR-1234', tipo: 'VUC' },
];

interface AlocacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  carga: any;
  onConfirm: (cargaId: string, motorista: string, veiculo: string) => void;
}

const AlocacaoModal: React.FC<AlocacaoModalProps> = ({
  isOpen,
  onClose,
  carga,
  onConfirm
}) => {
  const [motoristaSelected, setMotoristaSelected] = useState('');
  const [veiculoSelected, setVeiculoSelected] = useState('');

  const handleConfirm = () => {
    if (motoristaSelected && veiculoSelected) {
      onConfirm(carga.id, motoristaSelected, veiculoSelected);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Alocar Motorista e Veículo</DialogTitle>
          <DialogDescription>
            Carga: {carga.id} - Destino: {carga.destino}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="motorista">Motorista</Label>
            <Select 
              value={motoristaSelected} 
              onValueChange={setMotoristaSelected}
            >
              <SelectTrigger id="motorista">
                <SelectValue placeholder="Selecione um motorista" />
              </SelectTrigger>
              <SelectContent>
                {motoristasDisponiveis.map((motorista) => (
                  <SelectItem key={motorista.id} value={motorista.nome}>
                    {motorista.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="veiculo">Veículo</Label>
            <Select 
              value={veiculoSelected} 
              onValueChange={setVeiculoSelected}
            >
              <SelectTrigger id="veiculo">
                <SelectValue placeholder="Selecione um veículo" />
              </SelectTrigger>
              <SelectContent>
                {veiculosDisponiveis.map((veiculo) => (
                  <SelectItem key={veiculo.placa} value={veiculo.placa}>
                    {veiculo.placa} - {veiculo.tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!motoristaSelected || !veiculoSelected}
          >
            Confirmar Alocação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlocacaoModal;
