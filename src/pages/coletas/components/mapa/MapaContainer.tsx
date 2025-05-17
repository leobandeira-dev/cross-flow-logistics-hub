
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
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  // Function to initialize map after script is loaded
  const initMap = () => {
    if (!mapRef.current || !window.google) return;
    
    try {
      // Create map
      const newMap = new google.maps.Map(mapRef.current, {
        center: { lat: -23.5505, lng: -46.6333 }, // São Paulo como centro inicial
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      
      googleMapRef.current = newMap;
      
      // Add markers for each cargo
      if (cargas.length > 0) {
        initializeMarkers(newMap, cargas, markersRef, directionsRendererRef, setSelectedCardId);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error initializing map:", error);
      setIsLoading(false);
    }
  };

  // Function to load Google Maps script
  const loadGoogleMapsScript = () => {
    // Check if the script is already in the document
    const existingScript = document.getElementById('google-maps-script');
    
    if (!existingScript) {
      const googleMapsScript = document.createElement('script');
      googleMapsScript.id = 'google-maps-script';
      googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBpywkIjAfeo7YKzS85lcLxJFCAEfcQPmg&libraries=places&callback=initMap&loading=async`;
      googleMapsScript.async = true;
      googleMapsScript.defer = true;
      
      // Add global callback
      window.initMap = initMap;
      
      document.head.appendChild(googleMapsScript);
      scriptRef.current = googleMapsScript;
    } else if (window.google && window.google.maps) {
      // Script exists and Google Maps is loaded
      initMap();
    }
  };

  useEffect(() => {
    // Load the Google Maps script when the component mounts
    loadGoogleMapsScript();
    
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
      
      // Clear directions renderer
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
        directionsRendererRef.current = null;
      }
      
      // Clear map
      if (googleMapRef.current) {
        google.maps.event.clearInstanceListeners(googleMapRef.current);
        googleMapRef.current = null;
      }
      
      // Clean up global callback to avoid memory leaks
      if (window.initMap) {
        window.initMap = () => {};
      }
    };
  }, []);

  // Effect to update markers when cargas or selectedCardId change
  useEffect(() => {
    if (googleMapRef.current && cargas.length > 0) {
      // Clear existing markers before adding new ones
      markersRef.current.forEach(marker => {
        marker.setMap(null);
      });
      markersRef.current = [];
      
      // Clear directions renderer
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
        directionsRendererRef.current = null;
      }
      
      initializeMarkers(googleMapRef.current, cargas, markersRef, directionsRendererRef, setSelectedCardId);
    }
  }, [cargas, selectedCardId, setSelectedCardId]);

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
