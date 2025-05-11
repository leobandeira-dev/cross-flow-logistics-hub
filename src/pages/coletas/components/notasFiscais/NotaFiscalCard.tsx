
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NotaFiscalVolume, calcularSubtotaisNota } from '../../utils/volumeCalculations';
import VolumesInputForm from '../VolumesInputForm';
import { Trash2, User, FileText, DollarSign } from 'lucide-react';

interface NotaFiscalCardProps {
  index: number;
  nf: NotaFiscalVolume;
  onRemove: () => void;
  onUpdateNumeroNF: (numeroNF: string) => void;
  onUpdateRemetente: (remetente: string) => void;
  onUpdateDestinatario: (destinatario: string) => void;
  onUpdateValorTotal: (valorTotalStr: string) => void;
  onUpdateVolumes: (volumes: any[]) => void;
}

const NotaFiscalCard: React.FC<NotaFiscalCardProps> = ({
  index,
  nf,
  onRemove,
  onUpdateNumeroNF,
  onUpdateRemetente,
  onUpdateDestinatario,
  onUpdateValorTotal,
  onUpdateVolumes
}) => {
  const subtotais = calcularSubtotaisNota(nf.volumes);
  
  return (
    <Card key={index} className="mb-6">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Nota Fiscal {index + 1}</CardTitle>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          className="text-red-500 hover:text-red-700" 
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`nf-${index}`} className="flex items-center gap-1">
                <FileText className="h-4 w-4" /> Número da Nota Fiscal
              </Label>
              <Input 
                id={`nf-${index}`}
                value={nf.numeroNF} 
                onChange={(e) => onUpdateNumeroNF(e.target.value)}
                placeholder="Digite o número da NF"
              />
            </div>
            <div>
              <Label htmlFor={`valor-${index}`} className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" /> Valor Total (R$)
              </Label>
              <Input 
                id={`valor-${index}`}
                type="number" 
                step="0.01"
                value={nf.valorTotal || ''} 
                onChange={(e) => onUpdateValorTotal(e.target.value)}
                placeholder="0,00"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`remetente-${index}`} className="flex items-center gap-1">
                <User className="h-4 w-4" /> Remetente
              </Label>
              <Input 
                id={`remetente-${index}`}
                value={nf.remetente || ''} 
                onChange={(e) => onUpdateRemetente(e.target.value)}
                placeholder="Nome do remetente"
              />
            </div>
            <div>
              <Label htmlFor={`destinatario-${index}`} className="flex items-center gap-1">
                <User className="h-4 w-4" /> Destinatário
              </Label>
              <Input 
                id={`destinatario-${index}`}
                value={nf.destinatario || ''} 
                onChange={(e) => onUpdateDestinatario(e.target.value)}
                placeholder="Nome do destinatário"
              />
            </div>
          </div>
          
          <VolumesInputForm 
            volumes={nf.volumes.map(v => ({ ...v, id: v.id || `vol-${Math.random().toString(36).substr(2, 9)}` }))} 
            onChange={onUpdateVolumes} 
          />
          
          <div className="flex justify-end pt-2">
            <div className="text-right">
              <div className="font-medium">Subtotal da NF:</div>
              <div className="text-sm">
                <div>Volume: {subtotais.volumeTotal.toFixed(3)} m³</div>
                <div>Peso: {subtotais.pesoTotal.toFixed(2)} kg</div>
                <div>Peso Cubado: {subtotais.pesoCubadoTotal.toFixed(2)} kg</div>
                {nf.valorTotal > 0 && (
                  <div>Valor Total: R$ {nf.valorTotal.toFixed(2)}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotaFiscalCard;
