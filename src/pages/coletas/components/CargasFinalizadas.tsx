
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Carga } from '../types/coleta.types';
import { Badge } from '@/components/ui/badge';
import SearchFilter from '@/components/common/SearchFilter';

interface CargasFinalizadasProps {
  cargas: Carga[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const CargasFinalizadas: React.FC<CargasFinalizadasProps> = ({ 
  cargas, 
  currentPage, 
  setCurrentPage 
}) => {
  const [searchValue, setSearchValue] = useState('');
  
  // Filtrar cargas baseado na busca
  const filteredCargas = cargas.filter(carga => {
    if (!searchValue) return true;
    
    const searchLower = searchValue.toLowerCase();
    return (
      carga.id.toLowerCase().includes(searchLower) || 
      carga.destino.toLowerCase().includes(searchLower) ||
      carga.motorista?.toLowerCase().includes(searchLower)
    );
  });
  
  // Configuração dos filtros
  const filterConfig = [
    {
      name: "Status",
      options: [
        { label: "Todos", value: "all" },
        { label: "Entregue", value: "delivered" },
        { label: "Problema", value: "problem" }
      ]
    },
    {
      name: "Período",
      options: [
        { label: "Todos", value: "all" },
        { label: "Hoje", value: "today" },
        { label: "Esta semana", value: "this-week" },
        { label: "Este mês", value: "this-month" }
      ]
    }
  ];
  
  // Paginação
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredCargas.length / itemsPerPage);
  const currentItems = filteredCargas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handleSearch = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <SearchFilter 
        placeholder="Buscar por motorista, destino ou número da coleta..."
        onSearch={handleSearch}
        filters={filterConfig}
      />
      
      <Card>
        <CardHeader className="py-4">
          <CardTitle>Coletas Finalizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Número</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Motorista</TableHead>
                  <TableHead>Data Entrega</TableHead>
                  <TableHead className="text-center">Volumes</TableHead>
                  <TableHead>Peso</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhuma coleta finalizada encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((carga) => (
                    <TableRow key={carga.id}>
                      <TableCell className="font-medium">{carga.id}</TableCell>
                      <TableCell>{carga.destino}</TableCell>
                      <TableCell>{carga.motorista}</TableCell>
                      <TableCell>{carga.dataEntrega}</TableCell>
                      <TableCell className="text-center">{carga.volumes}</TableCell>
                      <TableCell>{carga.peso}</TableCell>
                      <TableCell>
                        <Badge variant={carga.status === 'delivered' ? "success" : "destructive"}>
                          {carga.status === 'delivered' ? 'Entregue' : 'Problema'}
                        </Badge>
                      </TableCell>
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
                    onClick={() => setCurrentPage(i + 1)}
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
  );
};

export default CargasFinalizadas;
