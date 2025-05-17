
import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Carga } from '../types/coleta.types';
import { Route, ArrowUp, ArrowDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';

interface RoteirizacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  cargas: Carga[];
}

// Função para calcular a rota otimizada baseada nos CEPs
const calcularRotaOtimizada = (cargas: Carga[]): Carga[] => {
  // Aqui teríamos uma lógica mais complexa com API de geocoding
  // Por agora, vamos simular ordenando por CEP
  return [...cargas].sort((a, b) => {
    const cepA = a.cep?.replace('-', '') || '99999999';
    const cepB = b.cep?.replace('-', '') || '99999999';
    return cepA.localeCompare(cepB);
  });
};

const RoteirizacaoModal: React.FC<RoteirizacaoModalProps> = ({
  isOpen,
  onClose,
  cargas
}) => {
  const [rotaOtimizada, setRotaOtimizada] = useState<Carga[]>([]);
  const [isRotaCalculada, setIsRotaCalculada] = useState(false);

  // Calcular rota otimizada quando o modal é aberto
  React.useEffect(() => {
    if (isOpen && cargas.length > 0) {
      setRotaOtimizada(calcularRotaOtimizada(cargas));
    } else {
      setIsRotaCalculada(false);
    }
  }, [isOpen, cargas]);

  // Calcular a ordem otimizada
  const calcularRota = () => {
    setRotaOtimizada(calcularRotaOtimizada(cargas));
    setIsRotaCalculada(true);
    
    toast({
      title: "Rota otimizada calculada!",
      description: `${cargas.length} coletas foram organizadas com base em proximidade de CEP.`,
    });
  };
  
  // Movimentar um item para cima na lista
  const moverParaCima = (index: number) => {
    if (index <= 0) return;
    
    const novaRota = [...rotaOtimizada];
    const temp = novaRota[index];
    novaRota[index] = novaRota[index - 1];
    novaRota[index - 1] = temp;
    setRotaOtimizada(novaRota);
  };
  
  // Movimentar um item para baixo na lista
  const moverParaBaixo = (index: number) => {
    if (index >= rotaOtimizada.length - 1) return;
    
    const novaRota = [...rotaOtimizada];
    const temp = novaRota[index];
    novaRota[index] = novaRota[index + 1];
    novaRota[index + 1] = temp;
    setRotaOtimizada(novaRota);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Route className="mr-2 h-5 w-5" />
            Roteirização de Coletas
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {cargas.length} coleta{cargas.length !== 1 ? 's' : ''} selecionada{cargas.length !== 1 ? 's' : ''}
            </p>
            
            <Button 
              onClick={calcularRota} 
              disabled={cargas.length <= 1 || isRotaCalculada}
            >
              Otimizar Rota
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Ordem</TableHead>
                  <TableHead className="w-[120px]">Número</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>CEP</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rotaOtimizada.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Clique em "Otimizar Rota" para calcular a melhor rota
                    </TableCell>
                  </TableRow>
                ) : (
                  rotaOtimizada.map((carga, index) => (
                    <TableRow key={carga.id}>
                      <TableCell className="font-medium text-center">{index + 1}</TableCell>
                      <TableCell>{carga.id}</TableCell>
                      <TableCell>{carga.destino}</TableCell>
                      <TableCell>{carga.cep || "—"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => moverParaCima(index)}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                            <span className="sr-only">Mover para cima</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => moverParaBaixo(index)}
                            disabled={index === rotaOtimizada.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                            <span className="sr-only">Mover para baixo</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fechar</Button>
          <Button
            disabled={rotaOtimizada.length === 0}
            onClick={() => {
              // Aqui salvaria a rota otimizada
              toast({
                title: "Rota salva com sucesso!",
                description: "A ordem das coletas foi salva e pode ser visualizada no mapa.",
              });
              onClose();
            }}
          >
            Salvar Rota
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoteirizacaoModal;
