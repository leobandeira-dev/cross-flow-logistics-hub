
import React from 'react';
import { Button } from '@/components/ui/button';
import { Carga } from '../../types/coleta.types';
import { MapPin, CircleCheck, Circle } from 'lucide-react';

interface CargaCardsProps {
  cargas: Carga[];
  selectedCardId: string | null;
  onCardSelect: (carga: Carga) => void;
}

const CargaCards: React.FC<CargaCardsProps> = ({ cargas, selectedCardId, onCardSelect }) => {
  return (
    <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
      {cargas.map(carga => (
        <Button
          key={carga.id}
          variant="outline"
          className={`text-left justify-start p-3 h-auto ${
            carga.status === 'delivered' 
              ? 'border-blue-500' 
              : carga.status === 'problem'
                ? 'border-red-500'
                : 'border-gray-300'
          } ${
            selectedCardId === carga.id ? 'bg-secondary' : ''
          }`}
          onClick={() => onCardSelect(carga)}
        >
          {carga.status === 'delivered' ? (
            <CircleCheck className="mr-2 h-4 w-4 text-blue-500" />
          ) : carga.status === 'problem' ? (
            <Circle className="mr-2 h-4 w-4 text-red-500" />
          ) : (
            <MapPin className="mr-2 h-4 w-4 text-red-500" />
          )}
          <div className="truncate">
            <div className="font-medium truncate">{carga.destino}</div>
            <div className="text-xs text-muted-foreground truncate">{carga.id} • {carga.cep}</div>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default CargaCards;
