
import React, { useState } from 'react';
import CargasPendentes from './components/CargasPendentes';
import { Carga } from './types/coleta.types';

// This is mock data that would normally come from an API
const mockCargas: Carga[] = [
  {
    id: 'CARGA-001',
    destino: 'São Paulo',
    dataPrevisao: '15/05/2025',
    volumes: 25,
    peso: '350kg',
    status: 'pending'
  },
  {
    id: 'CARGA-002',
    destino: 'Rio de Janeiro',
    dataPrevisao: '16/05/2025',
    volumes: 18,
    peso: '245kg',
    status: 'scheduled'
  },
  {
    id: 'CARGA-003',
    destino: 'Belo Horizonte',
    dataPrevisao: '17/05/2025',
    volumes: 32,
    peso: '410kg',
    status: 'pending'
  },
  {
    id: 'CARGA-004',
    destino: 'Curitiba',
    dataPrevisao: '18/05/2025',
    volumes: 15,
    peso: '180kg',
    status: 'pending'
  }
];

const CargasAlocacao: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">Alocação de Cargas</h1>
      
      <CargasPendentes
        cargas={mockCargas}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default CargasAlocacao;
