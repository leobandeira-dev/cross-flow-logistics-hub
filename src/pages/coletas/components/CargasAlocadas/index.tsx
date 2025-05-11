
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SearchFilter from '@/components/common/SearchFilter';
import { toast } from '@/hooks/use-toast';
import { filterConfig } from './filterConfig';
import CargasTable from './CargasTable';

interface CargasAlocadasProps {
  cargas: any[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const CargasAlocadas: React.FC<CargasAlocadasProps> = ({ 
  cargas, 
  currentPage, 
  setCurrentPage 
}) => {
  const handleSearch = (value: string) => {
    console.log('Search:', value);
    // Implementar lógica de busca
  };
  
  const handleFilterChange = (filter: string, value: string) => {
    console.log(`Filter ${filter} changed to ${value}`);
    // Implementar lógica de filtro
  };

  const handleDesalocarMotorista = (cargaId: string, motorista: string) => {
    // Implementar lógica para desalocar motorista
    toast({
      title: "Motorista desalocado com sucesso",
      description: `O motorista ${motorista} foi removido da carga ${cargaId}.`,
    });
    console.log('Motorista desalocado:', motorista, 'da carga:', cargaId);
  };

  const handleFinalizarCarga = (cargaId: string, status: 'delivered' | 'problem') => {
    // Implementar lógica para finalizar carga
    const statusText = status === 'delivered' ? 'entregue' : 'com problema';
    toast({
      title: "Carga finalizada com sucesso",
      description: `A carga ${cargaId} foi marcada como ${statusText}.`,
    });
    console.log('Carga finalizada:', cargaId, 'Status:', status);
  };

  return (
    <>
      <SearchFilter 
        placeholder="Buscar por ID, motorista ou destino..."
        filters={filterConfig}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Cargas em Andamento</CardTitle>
        </CardHeader>
        <CardContent>
          <CargasTable 
            cargas={cargas}
            pagination={{
              totalPages: Math.ceil(cargas.length / 10),
              currentPage: currentPage,
              onPageChange: setCurrentPage
            }}
            onDesalocarMotorista={handleDesalocarMotorista}
            onFinalizarCarga={handleFinalizarCarga}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default CargasAlocadas;
