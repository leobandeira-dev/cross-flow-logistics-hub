
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
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  // Função para carregar o script do Google Maps
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Function to initialize map after script is loaded
    const initMap = () => {
      if (!mapRef.current) return;
      
      // Create map
      const newMap = new google.maps.Map(mapRef.current, {
        center: { lat: -23.5505, lng: -46.6333 }, // São Paulo como centro inicial
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      
      googleMapRef.current = newMap;
      
      // Add markers for each cargo
      initializeMarkers(newMap, cargas, markersRef, setSelectedCardId);
      
      setIsLoading(false);
    };

    // Set global callback function
    window.initMap = initMap;
    
    // Check if script already exists
    if (!scriptRef.current) {
      const googleMapsScript = document.createElement('script');
      googleMapsScript.id = 'google-maps-script';
      googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBpywkIjAfeo7YKzS85lcLxJFCAEfcQPmg&libraries=places&callback=initMap&loading=async`;
      googleMapsScript.async = true;
      googleMapsScript.defer = true;
      document.head.appendChild(googleMapsScript);
      scriptRef.current = googleMapsScript;
    } else {
      // If script exists but map needs to be reinitialized
      if (window.google && window.google.maps) {
        initMap();
      }
    }
    
    // Cleanup function
    return () => {
      // Clear markers
      if (markersRef.current.length > 0) {
        markersRef.current.forEach(marker => {
          google.maps.event.clearListeners(marker, 'click');
          marker.setMap(null);
        });
        markersRef.current = [];
      }
      
      // Clear map
      if (googleMapRef.current) {
        google.maps.event.clearInstanceListeners(googleMapRef.current);
        googleMapRef.current = null;
      }
      
      // Don't remove the script on component unmount, as it might be needed by other components
      // Instead, just clean up the callback to avoid memory leaks
      if (window.initMap) {
        window.initMap = () => {};
      }
    };
  }, [cargas, setSelectedCardId]);

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

// Add typing for the global window object
declare global {
  interface Window {
    initMap: () => void;
  }
}

export default MapaContainer;
