
// Utility functions for Google Maps integration
import { Carga } from '../../types/coleta.types';
import { toast } from '@/hooks/use-toast';

/**
 * Generate a Google Maps directions URL for a sequence of addresses
 * This can be used when the Maps API isn't working properly
 */
export const generateGoogleMapsDirectionsUrl = (cargas: Carga[]): string => {
  if (cargas.length === 0) return '';
  
  // Base URL for Google Maps directions
  let url = 'https://www.google.com/maps/dir/';
  
  // Add each address to the URL
  cargas.forEach((carga) => {
    const endereco = `${carga.destino}, ${carga.cep || ''}, Brasil`;
    // Replace spaces with '+' and encode the address for URL
    const encodedEndereco = encodeURIComponent(endereco);
    url += `${encodedEndereco}/`;
  });
  
  return url;
};

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
  if (!map || cargas.length === 0 || !window.google || !window.google.maps) return;
  
  try {
    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (marker) {
        google.maps.event.clearListeners(marker, 'click');
        marker.setMap(null);
      }
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
          
          try {
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
            
            // Create info window (but don't open it yet)
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
            
            // Add click event to the marker with proper cleanup
            marker.addListener('click', () => {
              onSelectCard(carga.id);
              
              // Close any open info windows first to prevent stacking
              markersRef.current.forEach(m => {
                google.maps.event.clearListeners(m, 'closeclick');
              });
              
              // Open the info window at the marker's position
              infoWindow.open({
                map,
                anchor: marker
              });
              
              // Add close listener to clean up when info window closes
              google.maps.event.addListenerOnce(infoWindow, 'closeclick', () => {
                infoWindow.close();
              });
            });
            
            // Extend the bounds to include this marker
            bounds.extend(position);
            
            // Adjust the map to include all markers
            if (index === cargas.length - 1) {
              try {
                map.fitBounds(bounds);
                
                // Avoid excessive zoom when there are few markers
                const zoomChangedListener = google.maps.event.addListenerOnce(map, 'idle', () => {
                  if (map.getZoom() && map.getZoom() > 16) {
                    map.setZoom(16);
                  }
                });
              } catch (error) {
                console.error("Error fitting bounds:", error);
              }
            }
          } catch (error) {
            console.error(`Error creating marker for ${enderecoCompleto}:`, error);
          }
        } else {
          console.warn(`Erro ao geocodificar ${enderecoCompleto}:`, status);
        }
      });
    });
    
    // If we have a route defined (more than one carga), show the route line
    if (cargas.length > 1) {
      try {
        renderRoute(map, cargas, directionsRendererRef);
      } catch (error) {
        console.error("Error rendering route:", error);
      }
    }
  } catch (error) {
    console.error("Error initializing markers:", error);
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
  if (cargasRota.length < 2 || !window.google || !window.google.maps) return;
  
  try {
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
          
          // Only show error toast if it's not a simple zero results error
          if (status !== "ZERO_RESULTS") {
            toast({
              title: "Erro ao calcular rota",
              description: "Não foi possível calcular a rota entre os pontos.",
              variant: "destructive"
            });
          }
        }
      }
    );
  } catch (error) {
    console.error("Error in renderRoute:", error);
  }
};
