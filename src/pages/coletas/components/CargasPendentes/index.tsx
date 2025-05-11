
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SearchFilter from '../../../../components/common/SearchFilter';
import { toast } from '@/hooks/use-toast';
import AlocacaoModal from '../AlocacaoModal';
import SupportDialog from '../shared/SupportDialog';
import CargasTable from './CargasTable';
import { filterConfig } from './filterConfig';

interface CargasPendentesProps {
  cargas: any[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const CargasPendentes: React.FC<CargasPendentesProps> = ({ cargas, currentPage, setCurrentPage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCarga, setSelectedCarga] = useState<any>(null);
  const [openSupportDialog, setOpenSupportDialog] = useState(false);
  
  const handleSearch = (value: string) => {
    console.log('Search:', value);
    // Implementar lógica de busca
  };
  
  const handleFilterChange = (filter: string, value: string) => {
    console.log(`Filter ${filter} changed to ${value}`);
    // Implementar lógica de filtro
  };

  const handleAlocarMotorista = (carga: any) => {
    setSelectedCarga(carga);
    setIsModalOpen(true);
  };

  const handleAlocacaoConfirmada = (cargaId: string, motorista: string, veiculo: string) => {
    // Implementar lógica para alocar motorista e veículo
    toast({
      title: "Motorista alocado com sucesso",
      description: `A carga ${cargaId} foi alocada para ${motorista} com o veículo ${veiculo}.`,
    });
    setIsModalOpen(false);
    console.log('Carga alocada:', cargaId, 'Motorista:', motorista, 'Veículo:', veiculo);
  };

  return (
    <>
      <SearchFilter 
        placeholder="Buscar por ID ou destino..."
        filters={filterConfig}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Cargas Pendentes de Alocação</CardTitle>
        </CardHeader>
        <CardContent>
          <CargasTable 
            cargas={cargas}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onAlocarMotorista={handleAlocarMotorista}
            setSelectedCarga={(carga) => {
              setSelectedCarga(carga);
              setOpenSupportDialog(true);
            }}
          />
        </CardContent>
      </Card>
      
      {isModalOpen && selectedCarga && (
        <AlocacaoModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          carga={selectedCarga}
          onConfirm={handleAlocacaoConfirmada}
        />
      )}

      {selectedCarga && (
        <SupportDialog 
          isOpen={openSupportDialog}
          onOpenChange={setOpenSupportDialog}
          cargaInfo={{
            id: selectedCarga.id,
            destino: selectedCarga.destino,
            motorista: selectedCarga.motorista || 'Não alocado',
            veiculo: selectedCarga.veiculo || 'Não alocado',
          }}
        />
      )}
    </>
  );
};

export default CargasPendentes;
