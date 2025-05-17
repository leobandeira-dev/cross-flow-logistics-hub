
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Carga } from '../types/coleta.types';
import { Map, MapPin, CircleCheck, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapaRotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  motorista: string | null;
  cargas: Carga[];
}

// Mock de dados de geolocalização para as cidades
const geocodingMock: Record<string, { lat: number, lng: number }> = {
  "01310-200": { lat: -23.5505, lng: -46.6333 }, // São Paulo
  "22041-011": { lat: -22.9068, lng: -43.1729 }, // Rio de Janeiro
  "30130-110": { lat: -19.9167, lng: -43.9345 }, // Belo Horizonte
  "80010-010": { lat: -25.4284, lng: -49.2733 }, // Curitiba
  "13015-904": { lat: -22.9064, lng: -47.0616 }, // Campinas
  "11010-000": { lat: -23.9618, lng: -46.3322 }, // Santos
  "18035-400": { lat: -23.5015, lng: -47.4526 }, // Sorocaba
  "default": { lat: -23.5505, lng: -46.6333 }, // Default (São Paulo)
};

const MapaRotaModal: React.FC<MapaRotaModalProps> = ({
  isOpen,
  onClose,
  motorista,
  cargas
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapObjectRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  
  useEffect(() => {
    if (!isOpen || !mapRef.current) return;
    
    // Setup do mapa (simulado)
    console.log("Inicializando mapa para visualizar as coletas");
    
    // Limpar mapa antigo se existir
    if (mapObjectRef.current) {
      markersRef.current.forEach(marker => {
        // Remover marcadores antigos (simulado)
        console.log("Removendo marcador antigo");
      });
      markersRef.current = [];
    }
    
    // Em uma implementação real, aqui usaríamos uma biblioteca de mapas como Leaflet, Google Maps ou Mapbox
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.innerHTML = `
          <div class="text-center p-6 bg-muted/30 rounded-md">
            <p class="text-muted-foreground mb-2">Mapa da rota com ${cargas.length} coletas</p>
            <div class="flex justify-center gap-4 mb-4">
              <div class="flex items-center">
                <span class="w-4 h-4 rounded-full bg-red-500 inline-block mr-2"></span>
                <span>Pendentes</span>
              </div>
              <div class="flex items-center">
                <span class="w-4 h-4 rounded-full bg-blue-500 inline-block mr-2"></span>
                <span>Finalizadas</span>
              </div>
            </div>
            <div class="border-2 border-dashed border-gray-300 p-4 rounded text-gray-500">
              Nesta área seria exibido o mapa interativo usando Google Maps ou Mapbox.
            </div>
          </div>
        `;
      }
    }, 100);
    
    // Adicionar marcadores para cada coleta (simulado)
    cargas.forEach(carga => {
      const coords = geocodingMock[carga.cep || "default"] || geocodingMock.default;
      const status = carga.status || 'pending';
      console.log(`Adicionando marcador para coleta ${carga.id} em ${coords.lat}, ${coords.lng} - Status: ${status}`);
    });
    
  }, [isOpen, cargas]);

  const openGoogleMaps = (carga: Carga) => {
    const address = `${carga.destino}, ${carga.cep}`;
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
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
                }`}
                onClick={() => openGoogleMaps(carga)}
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

          <div ref={mapRef} className="h-[400px] rounded-md border bg-muted/20 relative">
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <p>Carregando mapa...</p>
            </div>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            <p>Clique nos botões acima para abrir a localização no Google Maps.</p>
            <p>Ícones vermelhos representam coletas pendentes e ícones azuis representam coletas finalizadas.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapaRotaModal;
