
import React, { useState } from 'react';
import { filterConfig } from './filterConfig';
import { useFilteredCargasPendentes } from './useFilteredCargasPendentes';
import CargasPendentesCard from './CargasPendentesCard';
import CargasSupportDialog from './CargasSupportDialog';
import { useAlocacaoModal } from './useAlocacaoModal';
import AlocacaoModal from '../AlocacaoModal';
import SearchFilter from '@/components/common/SearchFilter';

interface CargasPendentesProps {
  cargas: any[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onAlocar?: (cargasIds: string[], motoristaId: string, motoristaName: string, veiculoId: string, veiculoName: string) => void;
  onPreAlocar?: (cargasIds: string[], tipoVeiculoId: string, tipoVeiculoNome: string) => void;
  onGerarPreRomaneio?: (cargasIds: string[], tipoVeiculoId: string, tipoVeiculoNome: string) => void;
}

const CargasPendentes: React.FC<CargasPendentesProps> = ({ 
  cargas, 
  currentPage, 
  setCurrentPage,
  onAlocar,
  onPreAlocar,
  onGerarPreRomaneio
}) => {
  const { 
    handleSearch, 
    handleFilterChange,
    filteredCargas
  } = useFilteredCargasPendentes({ cargas });
  
  const {
    isModalOpen,
    setIsModalOpen,
    selectedCarga,
    setSelectedCarga,
    handleAlocarMotorista,
    handleAlocacaoConfirmada
  } = useAlocacaoModal();
  
  const [openSupportDialog, setOpenSupportDialog] = useState(false);

  return (
    <>
      <SearchFilter 
        placeholder="Buscar por ID ou destino..."
        filters={filterConfig}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />
      
      <CargasPendentesCard 
        filteredCargas={filteredCargas}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onAlocarMotorista={handleAlocarMotorista}
        setSelectedCarga={(carga) => {
          setSelectedCarga(carga);
          setOpenSupportDialog(true);
        }}
        onAlocar={onAlocar}
        onPreAlocar={onPreAlocar}
        onGerarPreRomaneio={onGerarPreRomaneio}
      />
      
      {isModalOpen && selectedCarga && (
        <AlocacaoModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          cargas={[selectedCarga]} 
          onConfirm={(cargasIds, motoristaId, motoristaName, veiculoId, veiculoName) => {
            handleAlocacaoConfirmada(selectedCarga.id, motoristaName, veiculoName);
            if (onAlocar) {
              onAlocar(cargasIds, motoristaId, motoristaName, veiculoId, veiculoName);
            }
          }}
        />
      )}

      <CargasSupportDialog 
        isOpen={openSupportDialog}
        onOpenChange={setOpenSupportDialog}
        selectedCarga={selectedCarga}
      />
    </>
  );
};

export default CargasPendentes;
