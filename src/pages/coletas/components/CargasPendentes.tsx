
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carga } from '../types/coleta.types';
import { useMemo } from 'react';
import TableHeader from './CargasPendentes/TableHeader';
import CargasList from './CargasPendentes/CargasList';
import PaginationControls from './CargasPendentes/PaginationControls';
import AlocacaoModal from './AlocacaoModal';
import RoteirizacaoModal from './RoteirizacaoModal';

interface CargasPendentesProps {
  cargas: Carga[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onAlocar?: (cargasIds: string[], motoristaId: string, motoristaName: string, veiculoId: string, veiculoName: string) => void;
}

const CargasPendentes: React.FC<CargasPendentesProps> = ({ 
  cargas, 
  currentPage, 
  setCurrentPage,
  onAlocar
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCargasIds, setSelectedCargasIds] = useState<string[]>([]);
  const [isAlocacaoModalOpen, setIsAlocacaoModalOpen] = useState(false);
  const [isRoteirizacaoModalOpen, setIsRoteirizacaoModalOpen] = useState(false);

  const filteredCargas = useMemo(() => {
    if (!searchValue) return cargas;
    
    const searchLower = searchValue.toLowerCase();
    return cargas.filter(carga => 
      carga.id.toLowerCase().includes(searchLower) || 
      carga.destino.toLowerCase().includes(searchLower) ||
      carga.origem?.toLowerCase().includes(searchLower)
    );
  }, [cargas, searchValue]);

  // Reset selected cargas when the cargas list changes
  useEffect(() => {
    setSelectedCargasIds([]);
  }, [cargas]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };
  
  const toggleSelectCarga = (cargaId: string) => {
    setSelectedCargasIds(prev => 
      prev.includes(cargaId) 
        ? prev.filter(id => id !== cargaId) 
        : [...prev, cargaId]
    );
  };
  
  const toggleSelectAll = () => {
    if (selectedCargasIds.length === filteredCargas.length) {
      setSelectedCargasIds([]);
    } else {
      setSelectedCargasIds(filteredCargas.map(c => c.id));
    }
  };
  
  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredCargas.length / itemsPerPage);
  const currentItems = filteredCargas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  return (
    <>
      <div className="space-y-4">
        <TableHeader 
          onSearch={handleSearch}
          selectedCargasIds={selectedCargasIds}
          setIsRoteirizacaoModalOpen={setIsRoteirizacaoModalOpen}
          setIsAlocacaoModalOpen={setIsAlocacaoModalOpen}
        />

        <Card>
          <CardHeader className="py-4">
            <CardTitle>Coletas Pendentes de Alocação</CardTitle>
          </CardHeader>
          <CardContent>
            <CargasList 
              currentItems={currentItems}
              selectedCargasIds={selectedCargasIds}
              toggleSelectCarga={toggleSelectCarga}
              toggleSelectAll={toggleSelectAll}
              filteredCargas={filteredCargas}
            />

            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          </CardContent>
        </Card>
      </div>

      <AlocacaoModal
        isOpen={isAlocacaoModalOpen}
        onClose={() => setIsAlocacaoModalOpen(false)}
        cargas={cargas.filter(carga => selectedCargasIds.includes(carga.id))}
        onConfirm={(cargasIds, motoristaId, motoristaName, veiculoId, veiculoName) => {
          if (onAlocar) {
            onAlocar(selectedCargasIds, motoristaId, motoristaName, veiculoId, veiculoName);
          }
          setIsAlocacaoModalOpen(false);
        }}
      />

      <RoteirizacaoModal
        isOpen={isRoteirizacaoModalOpen}
        onClose={() => setIsRoteirizacaoModalOpen(false)}
        cargas={cargas.filter(carga => selectedCargasIds.includes(carga.id))}
      />
    </>
  );
};

export default CargasPendentes;
