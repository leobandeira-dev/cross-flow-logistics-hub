
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import VolumesInputForm from '../VolumesInputForm';
import { NotaFiscalVolume } from '../../utils/volumeCalculations';

interface NotaFiscalCardProps {
  nf: NotaFiscalVolume;
  index: number;
  onRemove: () => void;
  onUpdateNumeroNF: (numeroNF: string) => void;
  onUpdateRemetente: (remetente: string) => void;
  onUpdateDestinatario: (destinatario: string) => void;
  onUpdateValorTotal: (valorTotal: string) => void;
  onUpdateVolumes: (volumes: any[]) => void;
  isReadOnly?: boolean;
}

const NotaFiscalCard: React.FC<NotaFiscalCardProps> = ({
  nf,
  index,
  onRemove,
  onUpdateNumeroNF,
  onUpdateRemetente,
  onUpdateDestinatario,
  onUpdateValorTotal,
  onUpdateVolumes,
  isReadOnly = false
}) => {
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className="relative">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleExpanded}
            className="mr-2"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <h3 className="text-base font-medium">
            Nota Fiscal {nf.numeroNF ? `#${nf.numeroNF}` : `${index + 1}`}
          </h3>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={isReadOnly}
          className="h-8 w-8 text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>

      {expanded && (
        <CardContent className="pb-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor={`nf-numero-${index}`}>Número NF</Label>
              <Input
                id={`nf-numero-${index}`}
                value={nf.numeroNF}
                onChange={(e) => onUpdateNumeroNF(e.target.value)}
                placeholder="Número da NF"
                disabled={isReadOnly}
              />
            </div>
            <div>
              <Label htmlFor={`nf-remetente-${index}`}>Remetente</Label>
              <Input
                id={`nf-remetente-${index}`}
                value={nf.remetente}
                onChange={(e) => onUpdateRemetente(e.target.value)}
                placeholder="Nome do remetente"
                disabled={isReadOnly}
              />
            </div>
            <div>
              <Label htmlFor={`nf-destinatario-${index}`}>Destinatário</Label>
              <Input
                id={`nf-destinatario-${index}`}
                value={nf.destinatario}
                onChange={(e) => onUpdateDestinatario(e.target.value)}
                placeholder="Nome do destinatário"
                disabled={isReadOnly}
              />
            </div>
            <div>
              <Label htmlFor={`nf-valor-${index}`}>Valor Total (R$)</Label>
              <Input
                id={`nf-valor-${index}`}
                value={nf.valorTotal.toString()}
                onChange={(e) => onUpdateValorTotal(e.target.value)}
                placeholder="0,00"
                type="number"
                step="0.01"
                min="0"
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div className="mt-4">
            <Label>Volumes</Label>
            <VolumesInputForm
              volumes={nf.volumes || []}
              onChange={onUpdateVolumes}
              readOnly={isReadOnly}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default NotaFiscalCard;
