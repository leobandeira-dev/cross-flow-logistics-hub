
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Carga } from '../types/coleta.types';
import { Map } from 'lucide-react';
import CargaCards from './mapa/CargaCards';
import MapaContainer from './mapa/MapaContainer';
import RotaInfo from './mapa/RotaInfo';
import MapaLegenda from './mapa/MapaLegenda';

interface MapaRotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  motorista: string | null;
  cargas: Carga[];
}

const MapaRotaModal: React.FC<MapaRotaModalProps> = ({
  isOpen,
  onClose,
  motorista,
  cargas
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  
  // Função para abrir o Google Maps com o endereço
  const openGoogleMaps = (carga: Carga) => {
    const address = `${carga.destino}, ${carga.cep}, Brasil`;
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    
    // Destacar o card selecionado
    setSelectedCardId(carga.id);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Map className="mr-2 h-5 w-5" />
            {motorista ? `Rota de ${motorista}` : "Visualização das Coletas"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <CargaCards 
            cargas={cargas} 
            selectedCardId={selectedCardId} 
            onCardSelect={openGoogleMaps} 
          />

          <MapaContainer 
            cargas={cargas} 
            selectedCardId={selectedCardId} 
            setSelectedCardId={setSelectedCardId} 
          />

          <RotaInfo 
            showInfo={cargas.length > 1} 
            cargasCount={cargas.length} 
          />
          
          <MapaLegenda />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapaRotaModal;
