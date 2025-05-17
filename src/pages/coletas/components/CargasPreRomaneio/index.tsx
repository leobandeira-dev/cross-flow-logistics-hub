
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carga } from '../../types/coleta.types';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Archive, Package, Calculator, MapPin, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchFilter from '@/components/common/SearchFilter';
import { filterConfig } from './filterConfig';

interface CargasPreRomaneioProps {
  cargas: Carga[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onPreAlocar?: (cargasIds: string[], tipoVeiculoId: string, tipoVeiculoNome: string) => void;
}

const CargasPreRomaneio: React.FC<CargasPreRomaneioProps> = ({ 
  cargas, 
  currentPage, 
  setCurrentPage,
  onPreAlocar
}) => {
  const [searchValue, setSearchValue] = useState('');
  
  // Filter cargas by search value
  const filteredCargas = useMemo(() => {
    if (!searchValue) return cargas;
    
    const searchLower = searchValue.toLowerCase();
    return cargas.filter(carga => 
      carga.id.toLowerCase().includes(searchLower) || 
      carga.destino.toLowerCase().includes(searchLower) ||
      carga.origem?.toLowerCase().includes(searchLower)
    );
  }, [cargas, searchValue]);
  
  // Group cargas by CEP region (first 3 digits)
  const groupedCargas = useMemo(() => {
    const groups: Record<string, Carga[]> = {};
    
    filteredCargas.forEach(carga => {
      if (!carga.cep) return;
      
      const cepRegion = carga.cep.substring(0, 3);
      const groupName = `Região ${cepRegion}xx-xxx`;
      
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      
      groups[groupName].push(carga);
    });
    
    return groups;
  }, [filteredCargas]);
  
  // Calculate total volume and weight for each group
  const groupTotals = useMemo(() => {
    const totals: Record<string, { totalVolumes: number, totalPeso: number, totalM3: number }> = {};
    
    Object.entries(groupedCargas).forEach(([groupName, cargas]) => {
      totals[groupName] = cargas.reduce((acc, carga) => {
        return {
          totalVolumes: acc.totalVolumes + carga.volumes,
          totalPeso: acc.totalPeso + parseFloat(carga.peso.replace('kg', '').trim()),
          totalM3: acc.totalM3 + (carga.volumeM3 || 0)
        };
      }, { totalVolumes: 0, totalPeso: 0, totalM3: 0 });
    });
    
    return totals;
  }, [groupedCargas]);
  
  const handleSearch = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SearchFilter
          placeholder="Buscar por destino, origem ou número da coleta..."
          onSearch={handleSearch}
          filters={filterConfig}
        />
      </div>
      
      {Object.keys(groupedCargas).length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <Archive className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p>Nenhuma carga encontrada para pré-romaneio</p>
          </CardContent>
        </Card>
      )}
      
      {Object.entries(groupedCargas).map(([groupName, groupCargas]) => (
        <Card key={groupName} className="mb-4">
          <CardHeader className="py-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              <CardTitle className="text-lg">{groupName}</CardTitle>
              <Badge variant="outline" className="ml-2">
                {groupCargas.length} cargas
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <Package className="h-4 w-4 mr-1" />
                <span>{groupTotals[groupName].totalVolumes} volumes</span>
              </div>
              <div className="flex items-center">
                <Calculator className="h-4 w-4 mr-1" />
                <span>{groupTotals[groupName].totalM3.toFixed(2)} m³</span>
              </div>
              <div>
                {groupTotals[groupName].totalPeso.toFixed(2)} kg
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground bg-muted/50">
                  <tr>
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Destino</th>
                    <th className="p-2 text-left">CEP</th>
                    <th className="p-2 text-center">Volumes</th>
                    <th className="p-2 text-center">Peso</th>
                    <th className="p-2 text-center">M³</th>
                    <th className="p-2 text-left">Veículo Sugerido</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {groupCargas.map((carga) => (
                    <tr key={carga.id} className="hover:bg-muted/30">
                      <td className="p-2 font-medium">{carga.id}</td>
                      <td className="p-2">{carga.destino}</td>
                      <td className="p-2">{carga.cep || "—"}</td>
                      <td className="p-2 text-center">{carga.volumes}</td>
                      <td className="p-2 text-center">{carga.peso}</td>
                      <td className="p-2 text-center">{carga.volumeM3?.toFixed(2) || "—"} m³</td>
                      <td className="p-2">
                        {carga.tipoVeiculo ? (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            {carga.tipoVeiculo}
                          </Badge>
                        ) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-medium">Total: </span>
                <span className="text-sm">{groupCargas.length} cargas • {groupTotals[groupName].totalVolumes} volumes • {groupTotals[groupName].totalM3.toFixed(2)} m³ • {groupTotals[groupName].totalPeso.toFixed(2)} kg</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Imprimir Pré-Romaneio</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CargasPreRomaneio;
