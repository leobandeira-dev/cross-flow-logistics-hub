import React, { useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Package, FileText, Check, Truck } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import SearchFilter from '@/components/common/SearchFilter';
import { toast } from '@/hooks/use-toast';

// Mock data
const recebimentosColeta = [
  { 
    id: 'COL-2023-001', 
    cliente: 'Cliente ABC', 
    numColeta: 'C12345', 
    data: '10/05/2023', 
    status: 'pending' 
  },
  { 
    id: 'COL-2023-002', 
    cliente: 'Cliente XYZ', 
    numColeta: 'C12346', 
    data: '11/05/2023', 
    status: 'processing' 
  },
  { 
    id: 'COL-2023-003', 
    cliente: 'Cliente DEF', 
    numColeta: 'C12347', 
    data: '12/05/2023', 
    status: 'completed' 
  },
  { 
    id: 'COL-2023-004', 
    cliente: 'Cliente GHI', 
    numColeta: 'C12348', 
    data: '13/05/2023', 
    status: 'pending' 
  },
];

const RecebimentoColeta: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('pendentes');
  
  const handleAcceptColeta = (coletaId: string) => {
    // Implementar lógica para aceitar coleta
    toast({
      title: "Coleta aceita com sucesso",
      description: `A coleta ${coletaId} foi aceita e está em processamento.`,
    });
    console.log('Coleta aceita:', coletaId);
  };

  const handleWhatsAppSupport = () => {
    // Número fictício para suporte via WhatsApp
    const phoneNumber = "5511912345678";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=Olá,%20preciso%20de%20suporte%20com%20uma%20coleta.`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <MainLayout title="Recebimento de Coleta">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading mb-2">Recebimento de Coleta</h2>
          <p className="text-gray-600">Processe recebimentos de mercadorias provenientes de coletas</p>
        </div>
        <Button 
          onClick={handleWhatsAppSupport}
          variant="outline"
          className="bg-green-500 hover:bg-green-600 text-white border-none"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mr-2 h-4 w-4"
          >
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
            <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
            <path d="M9 14a5 5 0 0 0 6 0" />
          </svg>
          Suporte via WhatsApp
        </Button>
      </div>
      
      <Tabs defaultValue="pendentes" className="mb-6" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="pendentes">Coletas Pendentes</TabsTrigger>
          <TabsTrigger value="processadas">Coletas Processadas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pendentes">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Package className="mr-2 text-cross-blue" size={20} />
                Coletas Aguardando Recebimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SearchFilter 
                placeholder="Buscar por cliente ou número de coleta..." 
                filters={[
                  {
                    name: "Status",
                    options: [
                      { label: "Todos", value: "all" },
                      { label: "Pendente de Aceite", value: "pending" },
                      { label: "Em Processamento", value: "processing" }
                    ]
                  }
                ]}
              />
              
              <DataTable
                columns={[
                  { header: 'ID', accessor: 'id' },
                  { header: 'Cliente', accessor: 'cliente' },
                  { header: 'Nº Coleta', accessor: 'numColeta' },
                  { header: 'Data', accessor: 'data' },
                  { 
                    header: 'Status', 
                    accessor: 'status',
                    cell: (row) => {
                      const statusMap: any = {
                        'pending': { type: 'warning', text: 'Pendente de Aceite' },
                        'processing': { type: 'info', text: 'Em Processamento' },
                        'completed': { type: 'success', text: 'Concluído' },
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
                        
                        {row.status === 'pending' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleAcceptColeta(row.id)}
                          >
                            <Check className="h-4 w-4 mr-1" /> Aceitar
                          </Button>
                        )}
                        
                        {row.status === 'processing' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-cross-blue text-white hover:bg-cross-blue/90"
                          >
                            <Truck className="h-4 w-4 mr-1" /> Receber
                          </Button>
                        )}
                      </div>
                    )
                  }
                ]}
                data={recebimentosColeta.filter(r => r.status !== 'completed')}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="processadas">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 text-cross-blue" size={20} />
                Coletas Recebidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SearchFilter 
                placeholder="Buscar por cliente ou número de coleta..." 
                filters={[
                  {
                    name: "Data",
                    options: [
                      { label: "Esta semana", value: "thisWeek" },
                      { label: "Este mês", value: "thisMonth" },
                      { label: "Último mês", value: "lastMonth" }
                    ]
                  }
                ]}
              />
              
              <DataTable
                columns={[
                  { header: 'ID', accessor: 'id' },
                  { header: 'Cliente', accessor: 'cliente' },
                  { header: 'Nº Coleta', accessor: 'numColeta' },
                  { header: 'Data', accessor: 'data' },
                  { 
                    header: 'Status', 
                    accessor: 'status',
                    cell: (row) => {
                      const statusMap: any = {
                        'pending': { type: 'warning', text: 'Pendente' },
                        'processing': { type: 'info', text: 'Em Processamento' },
                        'completed': { type: 'success', text: 'Concluído' },
                      };
                      const status = statusMap[row.status];
                      return <StatusBadge status={status.type} text={status.text} />;
                    }
                  },
                  {
                    header: 'Ações',
                    accessor: 'actions',
                    cell: () => (
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    )
                  }
                ]}
                data={recebimentosColeta.filter(r => r.status === 'completed')}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default RecebimentoColeta;
