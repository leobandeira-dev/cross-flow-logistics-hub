
// Utility functions for Google Maps integration
import { Carga } from '../../types/coleta.types';
import { toast } from '@/hooks/use-toast';

// Define window interface for Google Maps callback
declare global {
  interface Window {
    initMap: () => void;
  }
}

/**
 * Initialize markers on the map for each carga
 */
export const initializeMarkers = (
  map: google.maps.Map,
  cargas: Carga[],
  markersRef: React.MutableRefObject<google.maps.Marker[]>,
  directionsRendererRef: React.MutableRefObject<google.maps.DirectionsRenderer | null>,
  onSelectCard: (id: string) => void
): void => {
  if (!map || cargas.length === 0) return;
  
  // Clear existing markers
  markersRef.current.forEach(marker => {
    google.maps.event.clearListeners(marker, 'click');
    marker.setMap(null);
  });
  markersRef.current = [];
  
  const bounds = new google.maps.LatLngBounds();
  const geocoder = new google.maps.Geocoder();
  
  // For each carga, geocode the address
  cargas.forEach((carga, index) => {
    const enderecoCompleto = `${carga.destino}, ${carga.cep}, Brasil`;
    
    geocoder.geocode({ address: enderecoCompleto }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const position = results[0].geometry.location;
        
        // Create marker
        const marker = new google.maps.Marker({
          position,
          map,
          title: `${carga.id} - ${carga.destino}`,
          label: `${index + 1}`,
          icon: {
            url: carga.status === 'delivered' 
              ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' 
              : carga.status === 'problem'
                ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                : 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
          }
        });
        
        // Add to markers array
        markersRef.current.push(marker);
        
        // Add click event to the marker
        marker.addListener('click', () => {
          onSelectCard(carga.id);
          
          // Create info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 8px;">
                <h3 style="margin: 0; font-size: 16px;">${carga.destino}</h3>
                <p style="margin: 4px 0 0;">ID: ${carga.id}</p>
                <p style="margin: 4px 0 0;">CEP: ${carga.cep || 'N/A'}</p>
                <p style="margin: 4px 0 0;">Volumes: ${carga.volumes}</p>
              </div>
            `
          });
          
          // Fix: Use proper infoWindow.open() parameters
          infoWindow.open(map, marker);
        });
        
        // Extend the bounds of the map to include this marker
        bounds.extend(position);
        
        // Adjust the map to include all markers
        if (index === cargas.length - 1) {
          map.fitBounds(bounds);
          
          // Avoid excessive zoom when there are few markers
          const listener = google.maps.event.addListener(map, 'idle', () => {
            if (map.getZoom() && map.getZoom() > 16) {
              map.setZoom(16);
            }
            google.maps.event.removeListener(listener);
          });
        }
      } else {
        console.error(`Erro ao geocodificar ${enderecoCompleto}:`, status);
      }
    });
  });
  
  // If we have a route defined (more than one carga), show the route line
  if (cargas.length > 1) {
    renderRoute(map, cargas, directionsRendererRef);
  }
};

/**
 * Render a route between points on the map
 */
export const renderRoute = (
  map: google.maps.Map, 
  cargasRota: Carga[],
  directionsRendererRef: React.MutableRefObject<google.maps.DirectionsRenderer | null>
): void => {
  if (cargasRota.length < 2) return;
  
  const directionsService = new google.maps.DirectionsService();
  
  // Clear previous renderer if it exists
  if (directionsRendererRef.current) {
    directionsRendererRef.current.setMap(null);
  }
  
  // Create new renderer
  directionsRendererRef.current = new google.maps.DirectionsRenderer({
    map,
    suppressMarkers: true, // Don't show the default markers from directions
    polylineOptions: {
      strokeColor: '#4285F4',
      strokeWeight: 5,
      strokeOpacity: 0.7
    }
  });
  
  // Get addresses for origin and destinations
  const enderecos = cargasRota.map(carga => `${carga.destino}, ${carga.cep}, Brasil`);
  
  // Configure the route with the first as origin and the last as destination
  const origin = enderecos[0];
  const destination = enderecos[enderecos.length - 1];
  
  // Intermediate points (waypoints)
  const waypoints = enderecos.slice(1, -1).map(endereco => ({
    location: endereco,
    stopover: true
  }));
  
  // Request the route
  directionsService.route(
    {
      origin,
      destination,
      waypoints,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
    },
    (response, status) => {
      if (status === google.maps.DirectionsStatus.OK && directionsRendererRef.current) {
        directionsRendererRef.current.setDirections(response);
        
        // Calculate total distance and estimated time
        let distanciaTotal = 0;
        let tempoTotal = 0;
        
        const rota = response?.routes[0];
        if (rota && rota.legs) {
          rota.legs.forEach(leg => {
            if (leg.distance) distanciaTotal += leg.distance.value;
            if (leg.duration) tempoTotal += leg.duration.value;
          });
          
          // Convert to more readable formats
          const distanciaKm = (distanciaTotal / 1000).toFixed(1);
          const tempoHoras = Math.floor(tempoTotal / 3600);
          const tempoMinutos = Math.floor((tempoTotal % 3600) / 60);
          
          // Display route information
          toast({
            title: "Rota calculada",
            description: `Distância total: ${distanciaKm} km. Tempo estimado: ${tempoHoras}h ${tempoMinutos}min.`,
          });
        }
      } else {
        console.error('Erro ao calcular rota:', status);
        toast({
          title: "Erro ao calcular rota",
          description: "Não foi possível calcular a rota entre os pontos.",
          variant: "destructive"
        });
      }
    }
  );
};
