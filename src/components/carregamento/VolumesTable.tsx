
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Eye } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';

interface ItemConferencia {
  id: string;
  produto: string;
  quantidade: number;
  verificado: boolean;
  etiquetaMae: string;
  notaFiscal: string;
}

interface OrdemCarregamento {
  id: string;
  cliente: string;
  destinatario: string;
  dataCarregamento: string;
  volumesTotal: number;
  volumesVerificados: number;
  status: 'pending' | 'processing' | 'completed';
}

interface VolumesTableProps {
  ordemSelecionada: OrdemCarregamento | null;
  itens: ItemConferencia[];
  handleVerificarItem: (id: string) => void;
}

const VolumesTable: React.FC<VolumesTableProps> = ({ ordemSelecionada, itens, handleVerificarItem }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <CheckCircle className="mr-2 text-cross-blue" size={20} />
          Volumes para Conferência
        </CardTitle>
      </CardHeader>
      <CardContent>
        {ordemSelecionada ? (
          <DataTable
            columns={[
              { header: 'ID', accessor: 'id' },
              { header: 'Produto', accessor: 'produto' },
              { header: 'Qtd', accessor: 'quantidade' },
              { header: 'Etiqueta Mãe', accessor: 'etiquetaMae' },
              { header: 'Nota Fiscal', accessor: 'notaFiscal' },
              { 
                header: 'Status', 
                accessor: 'verificado',
                cell: (row) => {
                  return row.verificado ? 
                    <StatusBadge status="success" text="Verificado" /> : 
                    <StatusBadge status="warning" text="Pendente" />;
                }
              },
              {
                header: 'Ações',
                accessor: 'actions',
                cell: (row) => (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye size={16} className="mr-1" />
                      Detalhes
                    </Button>
                    {!row.verificado && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-cross-blue text-white hover:bg-cross-blue/90"
                        onClick={() => handleVerificarItem(row.id)}
                      >
                        <CheckCircle size={16} className="mr-1" />
                        Verificar
                      </Button>
                    )}
                  </div>
                )
              }
            ]}
            data={itens}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle size={40} className="mx-auto mb-4 opacity-30" />
            <p>Selecione uma ordem de carregamento para iniciar a conferência</p>
          </div>
        )}
        
        {ordemSelecionada && (
          <div className="flex justify-end mt-4">
            <Button 
              className="bg-cross-blue hover:bg-cross-blue/90"
              disabled={itens.some(item => !item.verificado)}
            >
              Finalizar Conferência
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VolumesTable;
