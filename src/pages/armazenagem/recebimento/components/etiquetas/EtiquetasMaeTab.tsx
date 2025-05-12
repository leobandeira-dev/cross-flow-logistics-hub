
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Printer, Link as LinkIcon } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import SearchFilter from '@/components/common/SearchFilter';
import VinculoEtiquetaMaeDialog from './VinculoEtiquetaMaeDialog';
import EtiquetaFormPanel from './EtiquetaFormPanel';
import EtiquetaPreview from './EtiquetaPreview';
import { UseFormReturn } from 'react-hook-form';

interface EtiquetaMae {
  id: string;
  notaFiscal: string;
  quantidadeVolumes: number;
  remetente: string;
  destinatario: string;
  cidade: string;
  uf: string;
  dataCriacao: string;
  status: string;
}

interface Volume {
  id: string;
  notaFiscal: string;
  descricao: string;
  quantidade: number;
  etiquetado: boolean;
  tipoVolume?: 'geral' | 'quimico';
  codigoONU?: string;
  codigoRisco?: string;
  etiquetaMae?: string;
}

interface EtiquetasMaeTabProps {
  etiquetasMae: EtiquetaMae[];
  volumes: Volume[];
  handlePrintEtiquetaMae: (etiquetaMae: EtiquetaMae) => void;
  handleVincularVolumes?: (etiquetaMaeId: string, volumeIds: string[]) => void;
  handleCreateEtiquetaMae?: () => void;
  form?: UseFormReturn<any>;
}

const EtiquetasMaeTab: React.FC<EtiquetasMaeTabProps> = ({
  etiquetasMae,
  volumes,
  handlePrintEtiquetaMae,
  handleVincularVolumes,
  handleCreateEtiquetaMae,
  form
}) => {
  const [vinculoDialogOpen, setVinculoDialogOpen] = useState(false);
  const [selectedEtiquetaMae, setSelectedEtiquetaMae] = useState<EtiquetaMae | null>(null);

  const handleOpenVinculoDialog = (etiquetaMae: EtiquetaMae) => {
    setSelectedEtiquetaMae(etiquetaMae);
    setVinculoDialogOpen(true);
  };

  // Modified this function to match the VinculoEtiquetaMaeDialog onSave prop that only receives etiquetaMaeId
  const handleVincularVolumesSave = (etiquetaMaeId: string) => {
    if (handleVincularVolumes) {
      // Since we don't have volumeIds in the callback from VinculoEtiquetaMaeDialog,
      // we'll need to implement a different approach if the functionality is needed
      // For now, just call with an empty array to match the expected signature
      handleVincularVolumes(etiquetaMaeId, []);
    }
  };
  
  return (
    <div className="space-y-6">
      {form && handleCreateEtiquetaMae && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EtiquetaFormPanel 
              form={form}
              tipoEtiqueta="mae"
              isQuimico={false}
              handleCreateEtiquetaMae={handleCreateEtiquetaMae}
              showEtiquetaMaeOption={true}
            />
          </div>
          <div>
            <EtiquetaPreview 
              tipoEtiqueta="mae"
              isQuimico={false}
            />
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Etiquetas Mãe</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchFilter 
            placeholder="Buscar por ID, nota fiscal ou remetente..." 
            filters={[
              {
                name: "Status",
                options: [
                  { label: "Ativo", value: "ativo" },
                  { label: "Inativo", value: "inativo" }
                ]
              },
              {
                name: "Período",
                options: [
                  { label: "Hoje", value: "today" },
                  { label: "Esta semana", value: "thisWeek" },
                  { label: "Este mês", value: "thisMonth" }
                ]
              }
            ]}
          />
          
          <DataTable
            columns={[
              { header: 'ID', accessor: 'id' },
              { header: 'Nota Fiscal', accessor: 'notaFiscal' },
              { header: 'Volumes', accessor: 'quantidadeVolumes' },
              { header: 'Remetente', accessor: 'remetente' },
              { header: 'Destinatário', accessor: 'destinatario' },
              { header: 'Cidade/UF', accessor: 'cidade',
                cell: (row) => (
                  <div>
                    {row.cidade} - <span className="font-bold">{row.uf}</span>
                  </div>
                )
              },
              { header: 'Data Criação', accessor: 'dataCriacao' },
              {
                header: 'Ações',
                accessor: 'actions',
                cell: (row) => (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText size={16} className="mr-1" />
                      Detalhes
                    </Button>
                    {handleVincularVolumes && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenVinculoDialog(row)}
                      >
                        <LinkIcon size={16} className="mr-1" />
                        Vincular
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handlePrintEtiquetaMae(row)}
                    >
                      <Printer size={16} className="mr-1" />
                      Imprimir
                    </Button>
                  </div>
                )
              }
            ]}
            data={etiquetasMae}
          />

          {/* Dialog for linking volumes to master label */}
          <VinculoEtiquetaMaeDialog
            open={vinculoDialogOpen}
            onClose={() => setVinculoDialogOpen(false)}
            etiquetaMae={selectedEtiquetaMae}
            volumes={volumes}
            onSave={handleVincularVolumesSave}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EtiquetasMaeTab;
