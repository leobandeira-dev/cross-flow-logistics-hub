
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Carga } from '../types/coleta.types';
import { useMemo } from 'react';
import SearchFilter from '@/components/common/SearchFilter';
import { filterConfig } from './CargasPendentes/filterConfig';
import AlocacaoModal from './AlocacaoModal';
import RoteirizacaoModal from './RoteirizacaoModal';
import { Tag, Route, Map } from 'lucide-react';

interface CargasPendentesProps {
  cargas: Carga[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onAlocar: (cargasIds: string[], motoristaId: string, motoristaName: string, veiculoId: string, veiculoName: string) => void;
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
  
  // Paginação
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <SearchFilter
            placeholder="Buscar por destino, origem ou número da coleta..."
            onSearch={handleSearch}
            filters={filterConfig}
          />
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="flex-1 sm:flex-none"
              onClick={() => setIsRoteirizacaoModalOpen(true)}
              disabled={selectedCargasIds.length === 0}
            >
              <Route className="mr-2 h-4 w-4" /> Roteirizar
            </Button>
            
            <Button 
              className="flex-1 sm:flex-none"
              onClick={() => setIsAlocacaoModalOpen(true)}
              disabled={selectedCargasIds.length === 0}
            >
              <Tag className="mr-2 h-4 w-4" /> Alocar Selecionados
            </Button>

            <Button 
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={() => setIsRoteirizacaoModalOpen(true)}
            >
              <Map className="mr-2 h-4 w-4" /> Ver Mapa
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="py-4">
            <CardTitle>Coletas Pendentes de Alocação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox 
                        checked={selectedCargasIds.length === filteredCargas.length && filteredCargas.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-[120px]">Número</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead>Previsão</TableHead>
                    <TableHead className="text-center">Volumes</TableHead>
                    <TableHead>Peso</TableHead>
                    <TableHead>CEP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        Nenhuma coleta pendente encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems.map((carga) => (
                      <TableRow key={carga.id} className="cursor-pointer hover:bg-muted/30">
                        <TableCell>
                          <Checkbox 
                            checked={selectedCargasIds.includes(carga.id)}
                            onCheckedChange={() => toggleSelectCarga(carga.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{carga.id}</TableCell>
                        <TableCell>{carga.origem || "—"}</TableCell>
                        <TableCell>{carga.destino}</TableCell>
                        <TableCell>{carga.dataPrevisao}</TableCell>
                        <TableCell className="text-center">{carga.volumes}</TableCell>
                        <TableCell>{carga.peso}</TableCell>
                        <TableCell>{carga.cep || "—"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Button 
                      key={i}
                      variant={currentPage === i + 1 ? "default" : "outline"} 
                      size="sm"
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlocacaoModal
        isOpen={isAlocacaoModalOpen}
        onClose={() => setIsAlocacaoModalOpen(false)}
        cargasIds={selectedCargasIds}
        cargas={cargas.filter(carga => selectedCargasIds.includes(carga.id))}
        onAlocar={(motoristaId, motoristaName, veiculoId, veiculoName) => {
          onAlocar(selectedCargasIds, motoristaId, motoristaName, veiculoId, veiculoName);
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
