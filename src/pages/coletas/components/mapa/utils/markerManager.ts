
import { Carga } from '../../../types/coleta.types';
import { renderRoute } from './routeRenderer';

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
              
              // The correct way to open an InfoWindow for Marker cast as MVCObject
              infoWindow.open(map, marker as unknown as google.maps.MVCObject);
              
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
