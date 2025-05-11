
import React, { useRef, useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, Search, Printer } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import SearchFilter from '@/components/common/SearchFilter';
import PrintLayoutModal from '@/components/carregamento/enderecamento/PrintLayoutModal';
import NotaFiscalForm from './components/NotaFiscalForm';

// Mock data
const notasFiscais = [
  { id: 'NF-2023-001', numero: '12345', fornecedor: 'Fornecedor A', data: '10/05/2023', valor: 'R$ 1.250,00', status: 'pending' },
  { id: 'NF-2023-002', numero: '12346', fornecedor: 'Fornecedor B', data: '09/05/2023', valor: 'R$ 2.150,00', status: 'processing' },
  { id: 'NF-2023-003', numero: '12347', fornecedor: 'Fornecedor C', data: '08/05/2023', valor: 'R$ 3.450,00', status: 'completed' },
];

const EntradaNotas: React.FC = () => {
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [selectedNota, setSelectedNota] = useState<string>('');
  const notaFiscalRef = useRef<HTMLDivElement>(null);
  
  const handlePrintClick = (notaId: string) => {
    setSelectedNota(notaId);
    setPrintModalOpen(true);
  };

  return (
    <MainLayout title="Entrada de Notas Fiscais">
      <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Entrada de Notas Fiscais</h2>
        <p className="text-gray-600">Registre e processe notas fiscais de entrada de mercadorias</p>
      </div>
      
      <Tabs defaultValue="cadastrar" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="cadastrar">Cadastrar Nota</TabsTrigger>
          <TabsTrigger value="consultar">Consultar Notas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cadastrar">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 text-cross-blue" size={20} />
                Cadastro de Nota Fiscal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <NotaFiscalForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="consultar">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notas Fiscais Registradas</CardTitle>
            </CardHeader>
            <CardContent>
              <SearchFilter 
                placeholder="Buscar por número ou fornecedor..." 
                filters={[
                  {
                    name: "Status",
                    options: [
                      { label: "Pendente", value: "pending" },
                      { label: "Em Processamento", value: "processing" },
                      { label: "Concluída", value: "completed" }
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
                  { header: 'Número NF', accessor: 'numero' },
                  { header: 'Fornecedor', accessor: 'fornecedor' },
                  { header: 'Data', accessor: 'data' },
                  { header: 'Valor', accessor: 'valor' },
                  { 
                    header: 'Status', 
                    accessor: 'status',
                    cell: (row) => {
                      const statusMap: any = {
                        'pending': { type: 'warning', text: 'Pendente' },
                        'processing': { type: 'info', text: 'Em Processamento' },
                        'completed': { type: 'success', text: 'Concluída' },
                      };
                      const status = statusMap[row.status];
                      return <StatusBadge status={status.type} text={status.text} />;
                    }
                  },
                  {
                    header: 'Ações',
                    accessor: 'actions',
                    cell: (row) => (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Detalhes</Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handlePrintClick(row.id)}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  }
                ]}
                data={notasFiscais}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Div oculto que servirá como template para impressão da nota fiscal */}
      <div className="hidden">
        <div ref={notaFiscalRef} className="p-4 bg-white">
          <h2 className="text-xl font-bold mb-4">Nota Fiscal - {selectedNota}</h2>
          <div className="border p-4">
            <p>Detalhes da Nota Fiscal {selectedNota}</p>
            <div className="mt-4 space-y-2">
              {selectedNota && notasFiscais.find(nota => nota.id === selectedNota) && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-500">Número:</p>
                      <p>{notasFiscais.find(nota => nota.id === selectedNota)?.numero}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fornecedor:</p>
                      <p>{notasFiscais.find(nota => nota.id === selectedNota)?.fornecedor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Data:</p>
                      <p>{notasFiscais.find(nota => nota.id === selectedNota)?.data}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Valor:</p>
                      <p>{notasFiscais.find(nota => nota.id === selectedNota)?.valor}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Status:</p>
                    <p>{notasFiscais.find(nota => nota.id === selectedNota)?.status === 'pending' ? 'Pendente' : 
                       notasFiscais.find(nota => nota.id === selectedNota)?.status === 'processing' ? 'Em Processamento' : 'Concluída'}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <PrintLayoutModal
        open={printModalOpen}
        onOpenChange={setPrintModalOpen}
        orderNumber={selectedNota}
        layoutRef={notaFiscalRef}
      />
    </MainLayout>
  );
};

export default EntradaNotas;
