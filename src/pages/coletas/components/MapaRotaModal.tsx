
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Carga } from '../types/coleta.types';
import { Map, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CargaCards from './mapa/CargaCards';
import MapaContainer from './mapa/MapaContainer';
import RotaInfo from './mapa/RotaInfo';
import MapaLegenda from './mapa/MapaLegenda';
import { generateGoogleMapsDirectionsUrl } from './mapa/GoogleMapsUtils';

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
  const [isMapReady, setIsMapReady] = useState(false);
  const modalContentRef = useRef<HTMLDivElement>(null);
  
  // Reset selected card when modal opens or cargas change
  useEffect(() => {
    if (isOpen) {
      setSelectedCardId(null);
      
      // Give the DOM time to render before initializing the map
      const timer = setTimeout(() => {
        setIsMapReady(true);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setIsMapReady(false);
    }
  }, [isOpen, cargas]);
  
  // Função para abrir o Google Maps com o endereço
  const openGoogleMaps = (carga: Carga) => {
    const address = `${carga.destino}, ${carga.cep}, Brasil`;
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    
    // Destacar o card selecionado
    setSelectedCardId(carga.id);
  };
  
  // Função para abrir o Google Maps com a rota completa
  const openGoogleMapsRoute = () => {
    const url = generateGoogleMapsDirectionsUrl(cargas);
    window.open(url, '_blank');
  };
  
  // Handle close with cleanup
  const handleClose = () => {
    setSelectedCardId(null);
    setIsMapReady(false);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[90vw] w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Map className="mr-2 h-5 w-5" />
              {motorista ? `Rota de ${motorista}` : "Visualização das Coletas"}
            </div>
            
            {cargas.length > 1 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2" 
                onClick={openGoogleMapsRoute}
              >
                <ExternalLink className="h-4 w-4" />
                Abrir rota no Google Maps
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4" ref={modalContentRef}>
          {isOpen && (
            <>
              <CargaCards 
                cargas={cargas} 
                selectedCardId={selectedCardId} 
                onCardSelect={openGoogleMaps} 
              />

              {isMapReady && (
                <MapaContainer 
                  cargas={cargas} 
                  selectedCardId={selectedCardId} 
                  setSelectedCardId={setSelectedCardId} 
                />
              )}

              <RotaInfo 
                showInfo={cargas.length > 1} 
                cargasCount={cargas.length} 
              />
              
              <MapaLegenda />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapaRotaModal;
