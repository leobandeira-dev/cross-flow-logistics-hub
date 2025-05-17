
import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CargasPendentes from './components/CargasPendentes';
import CargasEmRota from './components/CargasEmRota';
import CargasFinalizadas from './components/CargasFinalizadas';
import { Carga } from './types/coleta.types';
import { toast } from '@/hooks/use-toast';

// This is mock data that would normally come from an API
const mockCargas: Carga[] = [
  {
    id: 'CARGA-001',
    destino: 'São Paulo',
    origem: 'Rio de Janeiro',
    dataPrevisao: '15/05/2025',
    volumes: 25,
    peso: '350kg',
    status: 'pending',
    cep: '01310-200'
  },
  {
    id: 'CARGA-002',
    destino: 'Rio de Janeiro',
    origem: 'São Paulo',
    dataPrevisao: '16/05/2025',
    volumes: 18,
    peso: '245kg',
    status: 'transit',
    motorista: 'José da Silva',
    veiculo: 'Fiorino - ABC-1234',
    cep: '22041-011'
  },
  {
    id: 'CARGA-003',
    destino: 'Belo Horizonte',
    origem: 'São Paulo',
    dataPrevisao: '17/05/2025',
    volumes: 32,
    peso: '410kg',
    status: 'pending',
    cep: '30130-110'
  },
  {
    id: 'CARGA-004',
    destino: 'Curitiba',
    origem: 'São Paulo',
    dataPrevisao: '18/05/2025',
    volumes: 15,
    peso: '180kg',
    status: 'pending',
    cep: '80010-010'
  },
  {
    id: 'CARGA-005',
    destino: 'Campinas',
    origem: 'São Paulo',
    dataPrevisao: '15/05/2025',
    volumes: 22,
    peso: '290kg',
    status: 'transit',
    motorista: 'Carlos Santos',
    veiculo: 'Van - DEF-5678',
    cep: '13015-904'
  },
  {
    id: 'CARGA-006',
    destino: 'Santos',
    origem: 'São Paulo',
    dataPrevisao: '16/05/2025',
    volumes: 10,
    peso: '130kg',
    status: 'delivered',
    motorista: 'Pedro Oliveira',
    dataEntrega: '16/05/2025',
    cep: '11010-000'
  },
  {
    id: 'CARGA-007',
    destino: 'Sorocaba',
    origem: 'São Paulo',
    dataPrevisao: '17/05/2025',
    volumes: 18,
    peso: '210kg',
    status: 'delivered',
    motorista: 'Antônio Ferreira',
    dataEntrega: '17/05/2025',
    cep: '18035-400'
  }
];

const CargasAlocacao: React.FC = () => {
  const [cargasPendentes, setCargasPendentes] = useState<Carga[]>(
    mockCargas.filter(carga => carga.status === 'pending')
  );
  const [cargasEmRota, setCargasEmRota] = useState<Carga[]>(
    mockCargas.filter(carga => carga.status === 'transit' || carga.status === 'scheduled' || carga.status === 'loading')
  );
  const [cargasFinalizadas, setCargasFinalizadas] = useState<Carga[]>(
    mockCargas.filter(carga => carga.status === 'delivered' || carga.status === 'problem')
  );
  
  const [currentPendentesPage, setCurrentPendentesPage] = useState(1);
  const [currentEmRotaPage, setCurrentEmRotaPage] = useState(1);
  const [currentFinalizadasPage, setCurrentFinalizadasPage] = useState(1);

  // Função para pré-alocar cargas com um tipo de veículo
  const handlePreAlocarCargas = (cargasIds: string[], tipoVeiculoId: string, tipoVeiculoNome: string) => {
    // Atualizar as cargas pendentes com as informações do tipo de veículo
    const novasCargasPendentes = cargasPendentes.map(carga => {
      if (cargasIds.includes(carga.id)) {
        return {
          ...carga,
          tipoVeiculo: tipoVeiculoNome,
          tipoVeiculoId: tipoVeiculoId
        };
      }
      return carga;
    });
    
    setCargasPendentes(novasCargasPendentes);
    
    toast({
      title: "Pré-alocação concluída",
      description: `${cargasIds.length} carga(s) pré-alocada(s) para veículo tipo ${tipoVeiculoNome}.`,
    });
  };
  
  // Função para alocar coletas para um motorista
  const handleAlocarColetas = (cargasIds: string[], motoristaId: string, motoristaName: string, veiculoId: string, veiculoName: string) => {
    // Atualizar as cargas pendentes
    const novasCargasPendentes = cargasPendentes.filter(carga => !cargasIds.includes(carga.id));
    
    // Atualizar as cargas em rota com as novas alocações
    const cargasAlocadas = cargasPendentes
      .filter(carga => cargasIds.includes(carga.id))
      .map(carga => ({
        ...carga,
        status: 'transit' as const,
        motorista: motoristaName,
        veiculo: veiculoName
      }));
    
    setCargasPendentes(novasCargasPendentes);
    setCargasEmRota([...cargasEmRota, ...cargasAlocadas]);
    
    toast({
      title: "Cargas alocadas com sucesso!",
      description: `${cargasIds.length} carga(s) alocada(s) para ${motoristaName}.`,
    });
  };
  
  // Função para finalizar coletas
  const handleFinalizarColeta = (cargaId: string, status: 'delivered' | 'problem') => {
    const carga = cargasEmRota.find(c => c.id === cargaId);
    if (!carga) return;
    
    // Remove a carga das em rota
    const novasCargasEmRota = cargasEmRota.filter(carga => carga.id !== cargaId);
    
    // Adiciona nas finalizadas com status atualizado
    const cargaFinalizada = {
      ...carga,
      status,
      dataEntrega: new Date().toLocaleDateString()
    };
    
    setCargasEmRota(novasCargasEmRota);
    setCargasFinalizadas([cargaFinalizada, ...cargasFinalizadas]);
    
    toast({
      title: status === 'delivered' ? "Coleta entregue" : "Coleta finalizada com problema",
      description: `Carga ${cargaId} foi ${status === 'delivered' ? 'entregue' : 'finalizada com problema'}.`,
      variant: status === 'delivered' ? "default" : "destructive",
    });
  };

  return (
    <MainLayout title="Alocação de Cargas">
      <div className="space-y-6">
        <Tabs defaultValue="pendentes" className="w-full">
          <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
            <TabsTrigger value="pendentes">Não Alocadas</TabsTrigger>
            <TabsTrigger value="emrota">Em Rota</TabsTrigger>
            <TabsTrigger value="finalizadas">Finalizadas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pendentes" className="mt-4">
            <CargasPendentes
              cargas={cargasPendentes}
              currentPage={currentPendentesPage}
              setCurrentPage={setCurrentPendentesPage}
              onAlocar={handleAlocarColetas}
              onPreAlocar={handlePreAlocarCargas}
            />
          </TabsContent>
          
          <TabsContent value="emrota" className="mt-4">
            <CargasEmRota 
              cargas={cargasEmRota}
              currentPage={currentEmRotaPage}
              setCurrentPage={setCurrentEmRotaPage}
              onFinalizar={handleFinalizarColeta}
            />
          </TabsContent>
          
          <TabsContent value="finalizadas" className="mt-4">
            <CargasFinalizadas
              cargas={cargasFinalizadas}
              currentPage={currentFinalizadasPage}
              setCurrentPage={setCurrentFinalizadasPage}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CargasAlocacao;
