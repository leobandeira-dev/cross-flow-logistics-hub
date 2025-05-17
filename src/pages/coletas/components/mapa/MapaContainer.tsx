
import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Carga } from '../../types/coleta.types';
import { initializeMarkers } from './utils'; // Updated import path

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
  const mapsLoadedRef = useRef<boolean>(false);
  const isMountedRef = useRef(true);
  const mapInitializedRef = useRef(false);

  // Function to initialize map after script is loaded
  const initMap = () => {
    if (!mapRef.current || !window.google || !window.google.maps || !isMountedRef.current) return;
    
    try {
      // Prevent multiple initializations
      if (mapInitializedRef.current) return;
      mapInitializedRef.current = true;
      
      console.log("Initializing Google Map");
      
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
      
      if (isMountedRef.current) {
        setIsLoading(false);
        mapsLoadedRef.current = true;
      }
    } catch (error) {
      console.error("Error initializing map:", error);
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  // Function to load Google Maps script safely
  const loadGoogleMapsScript = () => {
    // Check if the script is already loaded
    if (window.google && window.google.maps) {
      initMap();
      return;
    }
    
    // Check if the script is already in the document
    const existingScript = document.getElementById('google-maps-script');
    
    if (!existingScript) {
      const googleMapsScript = document.createElement('script');
      googleMapsScript.id = 'google-maps-script';
      googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBpywkIjAfeo7YKzS85lcLxJFCAEfcQPmg&libraries=places&callback=initMap`;
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
  
  // Cleanup function to safely remove elements and listeners
  const cleanup = () => {
    // Clear markers
    if (markersRef.current && markersRef.current.length > 0) {
      for (let i = 0; i < markersRef.current.length; i++) {
        if (markersRef.current[i]) {
          google.maps.event.clearInstanceListeners(markersRef.current[i]);
          markersRef.current[i].setMap(null);
        }
      }
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
    
    // Reset initialization flag
    mapInitializedRef.current = false;
    
    // Clean up global callback but don't remove the script
    if (window.initMap) {
      window.initMap = () => {};
    }
  };

  // On mount
  useEffect(() => {
    console.log("MapaContainer mounting");
    isMountedRef.current = true;
    
    // Load the Google Maps script when the component mounts
    loadGoogleMapsScript();
    
    // Cleanup function for component unmount
    return () => {
      console.log("MapaContainer unmounting");
      isMountedRef.current = false;
      
      // Make sure we run cleanup synchronously before component is fully unmounted
      if (window.google && window.google.maps) {
        cleanup();
      }
    };
  }, []);

  // Effect to update markers safely when cargas or selectedCardId change
  useEffect(() => {
    if (!isMountedRef.current) return; // Skip if not mounted
    
    if (googleMapRef.current && window.google && cargas.length > 0 && mapsLoadedRef.current) {
      console.log("Updating markers");
      
      // Clear existing markers before adding new ones
      if (markersRef.current.length > 0) {
        for (let i = 0; i < markersRef.current.length; i++) {
          if (markersRef.current[i]) {
            google.maps.event.clearInstanceListeners(markersRef.current[i]);
            markersRef.current[i].setMap(null);
          }
        }
        markersRef.current = [];
      }
      
      // Clear directions renderer
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
        directionsRendererRef.current = null;
      }
      
      // Add new markers
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
