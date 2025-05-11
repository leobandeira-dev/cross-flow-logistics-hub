
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SearchFilter from '@/components/common/SearchFilter';
import { filterConfig } from './filterConfig';
import CargasTable from './CargasTable';

interface CargasFinalizadasProps {
  cargas: any[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const CargasFinalizadas: React.FC<CargasFinalizadasProps> = ({ 
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
          <CardTitle>Cargas Finalizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <CargasTable 
            cargas={cargas}
            pagination={{
              totalPages: Math.ceil(cargas.length / 10),
              currentPage: currentPage,
              onPageChange: setCurrentPage
            }}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default CargasFinalizadas;
