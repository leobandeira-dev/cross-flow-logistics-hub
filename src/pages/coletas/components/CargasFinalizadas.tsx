
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable from '../../../components/common/DataTable';
import { Button } from '@/components/ui/button';
import { FileText, MessageSquare } from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import SearchFilter from '../../../components/common/SearchFilter';
import { handleWhatsAppSupport, problemosComuns } from '../../motoristas/utils/supportHelpers';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const [selectedCarga, setSelectedCarga] = useState<any>(null);
  const [openSupportDialog, setOpenSupportDialog] = useState(false);
  
  const filters = [
    {
      name: 'Motorista',
      options: [
        { label: 'Todos', value: 'all' },
        { label: 'José da Silva', value: 'jose' },
        { label: 'Carlos Santos', value: 'carlos' },
        { label: 'Pedro Oliveira', value: 'pedro' },
        { label: 'Antônio Ferreira', value: 'antonio' },
        { label: 'Manuel Costa', value: 'manuel' },
      ]
    },
    {
      name: 'Status',
      options: [
        { label: 'Todos', value: 'all' },
        { label: 'Entregues', value: 'delivered' },
        { label: 'Com problemas', value: 'problem' },
      ]
    }
  ];

  const handleSearch = (value: string) => {
    console.log('Search:', value);
    // Implementar lógica de busca
  };
  
  const handleFilterChange = (filter: string, value: string) => {
    console.log(`Filter ${filter} changed to ${value}`);
    // Implementar lógica de filtro
  };

  const handleSupportRequest = (problem: string, description: string) => {
    if (!selectedCarga) return;
    
    const cargaInfo = {
      id: selectedCarga.id,
      destino: selectedCarga.destino,
      motorista: selectedCarga.motorista || 'Não alocado',
      veiculo: selectedCarga.veiculo || 'Não alocado',
    };
    
    const messageWithProblem = `${problem} - ${description} - `;
    
    handleWhatsAppSupport({
      ...cargaInfo,
      id: `${cargaInfo.id} - PROBLEMA: ${messageWithProblem}`
    });
    
    setOpenSupportDialog(false);
  };

  return (
    <>
      <SearchFilter 
        placeholder="Buscar por ID, motorista ou destino..."
        filters={filters}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Cargas Finalizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { header: 'ID', accessor: 'id' },
              { header: 'Destino', accessor: 'destino' },
              { header: 'Motorista', accessor: 'motorista' },
              { header: 'Veículo', accessor: 'veiculo' },
              { header: 'Data Entrega', accessor: 'dataEntrega', cell: (row) => row.dataEntrega || row.dataPrevisao },
              { header: 'Volumes', accessor: 'volumes' },
              { header: 'Peso', accessor: 'peso' },
              { 
                header: 'Status', 
                accessor: 'status',
                cell: (row) => {
                  const statusMap: any = {
                    'delivered': { type: 'success', text: 'Entregue' },
                    'problem': { type: 'error', text: 'Problema' }
                  };
                  const status = statusMap[row.status] || { type: 'default', text: 'Finalizado' };
                  return <StatusBadge status={status.type} text={status.text} />;
                }
              },
              { 
                header: 'Ações', 
                accessor: 'actions',
                className: "text-right w-[180px]",
                cell: (row) => (
                  <div className="flex space-x-2 justify-end">
                    <Dialog open={openSupportDialog && selectedCarga?.id === row.id} onOpenChange={(open) => {
                      if (open) {
                        setSelectedCarga(row);
                      }
                      setOpenSupportDialog(open);
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline"
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white border-none"
                          onClick={() => setSelectedCarga(row)}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" /> Suporte
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Solicitar Suporte - Carga {row.id}</DialogTitle>
                          <DialogDescription>
                            Selecione o problema que está enfrentando com esta carga:
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          {problemosComuns.map((problema, index) => (
                            <Button 
                              key={index} 
                              variant="outline" 
                              className="justify-start text-left px-4 py-3 h-auto"
                              onClick={() => handleSupportRequest(problema.title, problema.description)}
                            >
                              <div>
                                <div className="font-bold">{problema.title}</div>
                                <div className="text-sm text-gray-500">{problema.description}</div>
                              </div>
                            </Button>
                          ))}
                          <Button 
                            variant="outline" 
                            className="justify-start text-left px-4 py-3 h-auto"
                            onClick={() => handleWhatsAppSupport({
                              id: row.id,
                              destino: row.destino,
                              motorista: row.motorista,
                              veiculo: row.veiculo
                            })}
                          >
                            <div>
                              <div className="font-bold">Outro Problema</div>
                              <div className="text-sm text-gray-500">Problemas não listados acima</div>
                            </div>
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="outline"
                      size="sm"
                    >
                      <FileText className="h-4 w-4 mr-1" /> Detalhes
                    </Button>
                  </div>
                )
              }
            ]}
            data={cargas}
            pagination={{
              totalPages: Math.ceil(cargas.length / 10),
              currentPage: currentPage,
              onPageChange: setCurrentPage
            }}
            onRowClick={(row) => console.log('Row clicked:', row)}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default CargasFinalizadas;
