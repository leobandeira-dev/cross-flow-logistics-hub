
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
  onSelectCard: (id: string) => void
): void => {
  if (!map || cargas.length === 0) return;
  
  // Limpar marcadores existentes
  markersRef.current.forEach(marker => marker.setMap(null));
  markersRef.current = [];
  
  const bounds = new google.maps.LatLngBounds();
  const geocoder = new google.maps.Geocoder();
  
  // Para cada carga, fazer a geocodificação do endereço
  cargas.forEach((carga, index) => {
    const enderecoCompleto = `${carga.destino}, ${carga.cep}, Brasil`;
    
    geocoder.geocode({ address: enderecoCompleto }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const position = results[0].geometry.location;
        
        // Criar marcador
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
        
        // Adicionar ao array de marcadores
        markersRef.current.push(marker);
        
        // Adicionar evento de clique no marcador
        marker.addListener('click', () => {
          onSelectCard(carga.id);
          
          // Criar janela de informação
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
          
          // Usar o método open apenas com o mapa e definir a posição diretamente
          infoWindow.setPosition(marker.getPosition());
          infoWindow.open(map);
        });
        
        // Expandir os limites do mapa para incluir este marcador
        bounds.extend(position);
        
        // Ajustar o mapa para incluir todos os marcadores
        if (index === cargas.length - 1) {
          map.fitBounds(bounds);
          
          // Evitar zoom excessivo quando há poucos marcadores
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
  
  // Se temos uma rota definida (mais de uma carga), mostrar a linha da rota
  if (cargas.length > 1) {
    renderRoute(map, cargas);
  }
};

/**
 * Render a route between points on the map
 */
export const renderRoute = (map: google.maps.Map, cargasRota: Carga[]): void => {
  if (cargasRota.length < 2) return;
  
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer({
    map,
    suppressMarkers: true, // Não mostrar os marcadores padrão do directions
    polylineOptions: {
      strokeColor: '#4285F4',
      strokeWeight: 5,
      strokeOpacity: 0.7
    }
  });
  
  // Obter endereços para origem e destinos
  const enderecos = cargasRota.map(carga => `${carga.destino}, ${carga.cep}, Brasil`);
  
  // Configurar a rota com o primeiro como origem e o último como destino
  const origin = enderecos[0];
  const destination = enderecos[enderecos.length - 1];
  
  // Pontos intermediários (waypoints)
  const waypoints = enderecos.slice(1, -1).map(endereco => ({
    location: endereco,
    stopover: true
  }));
  
  // Solicitar a rota
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
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(response);
        
        // Calcular distância total e tempo estimado
        let distanciaTotal = 0;
        let tempoTotal = 0;
        
        const rota = response?.routes[0];
        if (rota && rota.legs) {
          rota.legs.forEach(leg => {
            if (leg.distance) distanciaTotal += leg.distance.value;
            if (leg.duration) tempoTotal += leg.duration.value;
          });
          
          // Converter para formatos mais legíveis
          const distanciaKm = (distanciaTotal / 1000).toFixed(1);
          const tempoHoras = Math.floor(tempoTotal / 3600);
          const tempoMinutos = Math.floor((tempoTotal % 3600) / 60);
          
          // Exibir informações da rota
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
