
import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Carga } from '../../types/coleta.types';
import { initializeMarkers } from './GoogleMapsUtils';

interface MapaContainerProps {
  cargas: Carga[];
  selectedCardId: string | null;
  setSelectedCardId: (id: string | null) => void;
}

const MapaContainer: React.FC<MapaContainerProps> = ({ 
  cargas, 
  selectedCardId, 
  setSelectedCardId 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função para carregar o script do Google Maps
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Cleanup function para remover o script quando o componente for desmontado
    const cleanupScript = () => {
      const existingScript = document.getElementById('google-maps-script');
      if (existingScript) {
        existingScript.remove();
      }
      
      // Limpar marcadores
      if (markersRef.current.length > 0) {
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
      }
      
      // Limpar mapa
      googleMapRef.current = null;
    };
    
    // Remover script existente antes de adicionar um novo
    cleanupScript();
    
    // Adicionar script do Google Maps
    const googleMapsScript = document.createElement('script');
    googleMapsScript.id = 'google-maps-script';
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBpywkIjAfeo7YKzS85lcLxJFCAEfcQPmg&libraries=places&callback=initMap`;
    googleMapsScript.async = true;
    googleMapsScript.defer = true;
    
    // Função para inicializar o mapa após o carregamento do script
    window.initMap = () => {
      if (!mapRef.current) return;
      
      // Criar mapa
      const newMap = new google.maps.Map(mapRef.current, {
        center: { lat: -23.5505, lng: -46.6333 }, // São Paulo como centro inicial
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      
      googleMapRef.current = newMap;
      
      // Adicionar marcadores para cada carga
      initializeMarkers(newMap, cargas, markersRef, setSelectedCardId);
      
      setIsLoading(false);
    };
    
    document.head.appendChild(googleMapsScript);
    
    return cleanupScript;
  }, [cargas]);

  return (
    <div ref={mapRef} className="h-[400px] rounded-md border bg-muted/20 relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="mt-2 text-sm text-muted-foreground">Carregando mapa...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapaContainer;
