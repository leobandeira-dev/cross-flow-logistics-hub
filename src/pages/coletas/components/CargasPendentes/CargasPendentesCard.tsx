
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CargasTable from './CargasTable';

interface CargasPendentesCardProps {
  filteredCargas: any[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onAlocarMotorista: (carga: any) => void;
  setSelectedCarga: (carga: any) => void;
}

const CargasPendentesCard: React.FC<CargasPendentesCardProps> = ({
  filteredCargas,
  currentPage,
  setCurrentPage,
  onAlocarMotorista,
  setSelectedCarga
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cargas Pendentes de Alocação</CardTitle>
      </CardHeader>
      <CardContent>
        <CargasTable 
          cargas={filteredCargas}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onAlocarMotorista={onAlocarMotorista}
          setSelectedCarga={setSelectedCarga}
        />
      </CardContent>
    </Card>
  );
};

export default CargasPendentesCard;
