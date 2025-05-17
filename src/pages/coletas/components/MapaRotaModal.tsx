
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Carga } from '../types/coleta.types';
import { Map, MapPin, CircleCheck, Circle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

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
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  
  // Função para carregar o script do Google Maps
  useEffect(() => {
    if (!isOpen || !mapRef.current) return;
    
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
      initializeMarkers(newMap);
      
      setIsLoading(false);
    };
    
    document.head.appendChild(googleMapsScript);
    
    return cleanupScript;
  }, [isOpen, cargas]);
  
  // Função para inicializar marcadores no mapa
  const initializeMarkers = (map: google.maps.Map) => {
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
            setSelectedCardId(carga.id);
            
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
            
            infoWindow.open(map, marker);
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
  
  // Função para renderizar a rota entre os pontos
  const renderRoute = (map: google.maps.Map, cargasRota: Carga[]) => {
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
        travelMode: google.maps.TravelMode.DRIVING
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
  
  // Função para abrir o Google Maps com o endereço
  const openGoogleMaps = (carga: Carga) => {
    const address = `${carga.destino}, ${carga.cep}, Brasil`;
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    
    // Destacar o card selecionado
    setSelectedCardId(carga.id);
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
                } ${
                  selectedCardId === carga.id ? 'bg-secondary' : ''
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
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="mt-2 text-sm text-muted-foreground">Carregando mapa...</span>
                </div>
              </div>
            )}
          </div>

          {cargas.length > 1 && (
            <div className="mt-4 p-3 bg-muted/30 rounded-md">
              <h3 className="text-sm font-medium mb-1">Informações da Rota</h3>
              <Separator className="my-2" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Cargas:</span> {cargas.length}
                </div>
                <div>
                  <span className="text-muted-foreground">Tipo:</span> Rota otimizada
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Clique nos botões acima para abrir a localização no Google Maps.</p>
            <p>
              <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span> Coletas entregues
              <span className="inline-block w-3 h-3 rounded-full bg-red-500 mx-1 ml-3"></span> Coletas com problema
              <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mx-1 ml-3"></span> Coletas pendentes
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Definir a interface global do window para o initMap
declare global {
  interface Window {
    initMap: () => void;
  }
}

export default MapaRotaModal;
