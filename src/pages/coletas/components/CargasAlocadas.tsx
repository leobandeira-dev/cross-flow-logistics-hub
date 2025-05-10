
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable from '../../../components/common/DataTable';
import { Button } from '@/components/ui/button';
import { FileText, UserX, MessageSquare } from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import SearchFilter from '../../../components/common/SearchFilter';
import { toast } from '@/hooks/use-toast';
import { handleWhatsAppSupport, problemosComuns } from '../../motoristas/utils/supportHelpers';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CargasAlocadasProps {
  cargas: any[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const CargasAlocadas: React.FC<CargasAlocadasProps> = ({ 
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
        { label: 'Em trânsito', value: 'transit' },
        { label: 'Em carregamento', value: 'loading' },
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

  const handleDesalocarMotorista = (cargaId: string, motorista: string) => {
    // Implementar lógica para desalocar motorista
    toast({
      title: "Motorista desalocado com sucesso",
      description: `O motorista ${motorista} foi removido da carga ${cargaId}.`,
    });
    console.log('Motorista desalocado:', motorista, 'da carga:', cargaId);
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
          <CardTitle>Cargas Alocadas</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { header: 'ID', accessor: 'id' },
              { header: 'Destino', accessor: 'destino' },
              { header: 'Motorista', accessor: 'motorista' },
              { header: 'Veículo', accessor: 'veiculo' },
              { header: 'Data Prevista', accessor: 'dataPrevisao', cell: (row) => row.dataPrevisao || row.dataEntrega },
              { header: 'Volumes', accessor: 'volumes' },
              { header: 'Peso', accessor: 'peso' },
              { 
                header: 'Status', 
                accessor: 'status',
                cell: (row) => {
                  const statusMap: any = {
                    'transit': { type: 'info', text: 'Em Trânsito' },
                    'loading': { type: 'warning', text: 'Em Carregamento' },
                    'scheduled': { type: 'default', text: 'Agendada' },
                    'delivered': { type: 'success', text: 'Entregue' },
                    'problem': { type: 'error', text: 'Problema' }
                  };
                  const status = statusMap[row.status];
                  return <StatusBadge status={status.type} text={status.text} />;
                }
              },
              { 
                header: 'Ações', 
                accessor: 'actions',
                className: "text-right w-[200px]",
                cell: (row) => {
                  const finalizado = row.status === 'delivered' || row.status === 'problem';
                  
                  return (
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
                      
                      {!finalizado && (
                        <Button 
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleDesalocarMotorista(row.id, row.motorista)}
                        >
                          <UserX className="h-4 w-4 mr-1" /> Desalocar
                        </Button>
                      )}
                    </div>
                  );
                }
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

export default CargasAlocadas;
