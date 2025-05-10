
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Eye, Plus, Minus } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { toast } from "@/hooks/use-toast";

interface ItemConferencia {
  id: string;
  produto: string;
  quantidade: number;
  verificado: boolean;
  etiquetaMae: string;
  notaFiscal: string;
}

export interface OrdemCarregamento {
  id: string;
  cliente: string;
  destinatario: string;
  dataCarregamento: string;
  volumesTotal: number;
  volumesVerificados: number;
  status: 'pending' | 'processing' | 'completed';
  inicioConferencia?: string;
  fimConferencia?: string;
  conferenteResponsavel?: string;
}

interface VolumesTableProps {
  ordemSelecionada: OrdemCarregamento | null;
  itens: ItemConferencia[];
  handleVerificarItem: (id: string) => void;
  handleRemoverItem?: (id: string) => void;
  tipoVisualizacao: 'conferir' | 'emConferencia' | 'conferidas';
}

const VolumesTable: React.FC<VolumesTableProps> = ({ 
  ordemSelecionada, 
  itens, 
  handleVerificarItem, 
  handleRemoverItem,
  tipoVisualizacao
}) => {
  const [itemParaRemover, setItemParaRemover] = React.useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const confirmarRemocao = (id: string) => {
    setItemParaRemover(id);
    setDialogOpen(true);
  };

  const removerItem = () => {
    if (itemParaRemover && handleRemoverItem) {
      handleRemoverItem(itemParaRemover);
      toast({
        title: "Item removido",
        description: `O item foi removido da ordem de carregamento.`,
      });
    }
    setDialogOpen(false);
    setItemParaRemover(null);
  };

  const getTitleByTipo = () => {
    switch (tipoVisualizacao) {
      case 'conferir': return 'Volumes para Conferência';
      case 'emConferencia': return 'Volumes em Conferência';
      case 'conferidas': return 'Volumes Conferidos';
    }
  };

  const renderConferenteInfo = (ordem: OrdemCarregamento) => {
    if (!ordem.conferenteResponsavel) return null;
    
    return (
      <div className="text-sm text-gray-500 mt-1">
        Conferente: {ordem.conferenteResponsavel}
      </div>
    );
  };

  const renderTimingInfo = (ordem: OrdemCarregamento) => {
    if (!ordem.inicioConferencia) return null;
    
    return (
      <div className="text-sm text-gray-500 mt-1">
        {ordem.inicioConferencia && `Início: ${ordem.inicioConferencia}`}
        {ordem.fimConferencia && ` • Fim: ${ordem.fimConferencia}`}
      </div>
    );
  };

  const renderEmptyState = () => {
    let message = "Selecione uma ordem de carregamento para iniciar a conferência";
    
    if (tipoVisualizacao === 'emConferencia') {
      message = "Não há ordens em conferência no momento";
    } else if (tipoVisualizacao === 'conferidas') {
      message = "Não há ordens conferidas para exibir";
    }
    
    return (
      <div className="text-center py-8 text-gray-500">
        <CheckCircle size={40} className="mx-auto mb-4 opacity-30" />
        <p>{message}</p>
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <CheckCircle className="mr-2 text-cross-blue" size={20} />
          {getTitleByTipo()}
        </CardTitle>
        {ordemSelecionada && (
          <>
            {renderConferenteInfo(ordemSelecionada)}
            {renderTimingInfo(ordemSelecionada)}
          </>
        )}
      </CardHeader>
      <CardContent>
        {ordemSelecionada ? (
          <DataTable
            columns={[
              { header: 'ID', accessor: 'id', className: 'w-[80px]' },
              { header: 'Produto', accessor: 'produto' },
              { header: 'Qtd', accessor: 'quantidade', className: 'w-[60px] text-center' },
              { header: 'Etiqueta Mãe', accessor: 'etiquetaMae' },
              { header: 'Nota Fiscal', accessor: 'notaFiscal' },
              { 
                header: 'Status', 
                accessor: 'verificado',
                className: 'w-[120px]',
                cell: (row) => {
                  return row.verificado ? 
                    <StatusBadge status="success" text="Verificado" /> : 
                    <StatusBadge status="warning" text="Pendente" />;
                }
              },
              {
                header: 'Ações',
                accessor: 'actions',
                className: 'w-[180px]',
                cell: (row) => (
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm">
                      <Eye size={16} className="mr-1" />
                      Detalhes
                    </Button>
                    {!row.verificado && tipoVisualizacao === 'conferir' && (
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
                    {handleRemoverItem && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-red-500 text-red-500 hover:bg-red-50"
                        onClick={() => confirmarRemocao(row.id)}
                      >
                        <Minus size={16} className="mr-1" />
                        Remover
                      </Button>
                    )}
                  </div>
                )
              }
            ]}
            data={itens}
          />
        ) : (
          renderEmptyState()
        )}
        
        {ordemSelecionada && tipoVisualizacao === 'conferir' && (
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar remoção</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover este item da ordem de carregamento?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={removerItem}
              className="bg-red-500 hover:bg-red-600"
            >
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default VolumesTable;
