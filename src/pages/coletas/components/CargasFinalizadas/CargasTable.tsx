
import React from 'react';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import ActionButtons from './ActionButtons';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { problemosComuns, handleWhatsAppSupport } from '../../../motoristas/utils/supportHelpers';
import { extrairApenasUF } from '@/utils/estadoUtils';

interface CargasTableProps {
  cargas: any[];
  pagination: {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
  };
}

const CargasTable: React.FC<CargasTableProps> = ({ cargas, pagination }) => {
  const [selectedCarga, setSelectedCarga] = React.useState<any>(null);
  const [openSupportDialog, setOpenSupportDialog] = React.useState(false);

  // Função para garantir que o destino esteja no formato "Cidade - UF" com UF de 2 letras
  const formatDestino = (destino: string): string => {
    if (!destino) return '';
    
    const match = destino.match(/(.+)\s+-\s+([A-Za-z]{2}|[A-Za-z\s]+)$/);
    if (match) {
      const cidade = match[1];
      const uf = extrairApenasUF(match[2]);
      return `${cidade} - ${uf}`;
    }
    
    return destino;
  };

  const handleSupportRequest = (problem: string, description: string) => {
    if (!selectedCarga) return;
    
    const cargaInfo = {
      id: selectedCarga.id,
      destino: formatDestino(selectedCarga.destino),
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
      <DataTable
        columns={[
          { header: 'ID', accessor: 'id' },
          { 
            header: 'Destino', 
            accessor: 'destino',
            cell: (row) => formatDestino(row.destino)
          },
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
              <ActionButtons 
                carga={row}
                setSelectedCarga={(carga) => {
                  setSelectedCarga(carga);
                  setOpenSupportDialog(true);
                }}
              />
            )
          }
        ]}
        data={cargas}
        pagination={pagination}
        onRowClick={(row) => console.log('Row clicked:', row)}
      />

      {selectedCarga && (
        <Dialog open={openSupportDialog} onOpenChange={setOpenSupportDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Solicitar Suporte - Carga {selectedCarga.id}</DialogTitle>
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
                  id: selectedCarga.id,
                  destino: formatDestino(selectedCarga.destino),
                  motorista: selectedCarga.motorista,
                  veiculo: selectedCarga.veiculo
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
      )}
    </>
  );
};

export default CargasTable;
