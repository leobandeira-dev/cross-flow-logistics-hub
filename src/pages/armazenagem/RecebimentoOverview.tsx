import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Archive, Box, Package, Truck, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchFilter from '@/components/common/SearchFilter';
import StatusBadge from '@/components/common/StatusBadge';
import DataTable from '@/components/common/DataTable';

// Mock data
const recebimentosPendentes = [
  { id: 'REC-2023-001', tipo: 'Fornecedor', origem: 'Fornecedor ABC', data: '15/05/2023', status: 'pending' },
  { id: 'REC-2023-002', tipo: 'Coleta', origem: 'Cliente XYZ', data: '14/05/2023', status: 'processing' },
  { id: 'REC-2023-003', tipo: 'Filial', origem: 'Filial Rio de Janeiro', data: '14/05/2023', status: 'pending' },
  { id: 'REC-2023-004', tipo: 'Fornecedor', origem: 'Fornecedor DEF', data: '13/05/2023', status: 'completed' },
];

const RecebimentoOverview: React.FC = () => {
  return (
    <MainLayout title="Armazenagem - Recebimento">
      <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Módulo de Armazenagem</h2>
        <p className="text-gray-600">Gerencie recebimentos, movimentações internas e carregamentos</p>
      </div>

      <Tabs defaultValue="recebimento" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="recebimento">Recebimento</TabsTrigger>
          <TabsTrigger value="movimentacoes">Movimentações</TabsTrigger>
          <TabsTrigger value="carregamento">Carregamento</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recebimento">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="hover:shadow-md transition-all cursor-pointer">
              <Link to="/armazenagem/recebimento/fornecedor">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Box className="mr-2 text-cross-blue" size={20} />
                    Recebimento de Fornecedor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Processe recebimentos de mercadorias vindas diretamente de fornecedores
                  </p>
                </CardContent>
              </Link>
            </Card>
            
            <Card className="hover:shadow-md transition-all cursor-pointer">
              <Link to="/armazenagem/recebimento/coleta">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Box className="mr-2 text-cross-blue" size={20} />
                    Recebimento de Coleta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Processe recebimentos de mercadorias coletadas dos clientes
                  </p>
                </CardContent>
              </Link>
            </Card>
            
            <Card className="hover:shadow-md transition-all cursor-pointer">
              <Link to="/armazenagem/recebimento/filiais">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Box className="mr-2 text-cross-blue" size={20} />
                    Recebimento Entre Filiais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Processe transferências e recebimentos entre filiais da empresa
                  </p>
                </CardContent>
              </Link>
            </Card>
            
            <Card className="hover:shadow-md transition-all cursor-pointer">
              <Link to="/armazenagem/recebimento/notas">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <FileText className="mr-2 text-cross-blue" size={20} />
                    Entrada de Notas Fiscais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Registre e processe notas fiscais de entrada de mercadorias
                  </p>
                </CardContent>
              </Link>
            </Card>
            
            <Card className="hover:shadow-md transition-all cursor-pointer">
              <Link to="/armazenagem/recebimento/etiquetas">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <FileText className="mr-2 text-cross-blue" size={20} />
                    Geração de Etiquetas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Gere etiquetas de identificação única para volumes
                  </p>
                </CardContent>
              </Link>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recebimentos Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <SearchFilter 
                placeholder="Buscar recebimentos..." 
                filters={[
                  {
                    name: "Tipo",
                    options: [
                      { label: "Fornecedor", value: "fornecedor" },
                      { label: "Coleta", value: "coleta" },
                      { label: "Filial", value: "filial" }
                    ]
                  },
                  {
                    name: "Status",
                    options: [
                      { label: "Pendente", value: "pending" },
                      { label: "Em Processamento", value: "processing" },
                      { label: "Concluído", value: "completed" }
                    ]
                  }
                ]}
              />
              
              <DataTable
                columns={[
                  { header: 'ID', accessor: 'id' },
                  { header: 'Tipo', accessor: 'tipo' },
                  { header: 'Origem', accessor: 'origem' },
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
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Detalhes</Button>
                        <Button variant="outline" size="sm" className="bg-cross-blue text-white hover:bg-cross-blue/90">
                          Processar
                        </Button>
                      </div>
                    )
                  }
                ]}
                data={recebimentosPendentes}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="movimentacoes">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="hover:shadow-md transition-all cursor-pointer">
              <Link to="/armazenagem/movimentacoes/unitizacao">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Package className="mr-2 text-cross-blue" size={20} />
                    Unitização de Paletes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Organize e unitize volumes em paletes
                  </p>
                </CardContent>
              </Link>
            </Card>
            
            <Card className="hover:shadow-md transition-all cursor-pointer">
              <Link to="/armazenagem/movimentacoes/cancelar-unitizacao">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Package className="mr-2 text-cross-blue" size={20} />
                    Cancelar Unitização
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Desfaça unitizações e reorganize volumes
                  </p>
                </CardContent>
              </Link>
            </Card>
            
            <Card className="hover:shadow-md transition-all cursor-pointer">
              <Link to="/armazenagem/movimentacoes/enderecamento">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Archive className="mr-2 text-cross-blue" size={20} />
                    Endereçamento de Volumes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Defina o endereçamento de volumes no armazém
                  </p>
                </CardContent>
              </Link>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="carregamento">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="hover:shadow-md transition-all cursor-pointer">
              <Link to="/armazenagem/carregamento/ordem">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <FileText className="mr-2 text-cross-blue" size={20} />
                    Ordem de Carregamento (OC)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Crie e gerencie ordens de carregamento
                  </p>
                </CardContent>
              </Link>
            </Card>
            
            <Card className="hover:shadow-md transition-all cursor-pointer">
              <Link to="/armazenagem/carregamento/conferencia">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <FileText className="mr-2 text-cross-blue" size={20} />
                    Conferência de Carga
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Confira volumes, notas fiscais ou etiquetas mãe
                  </p>
                </CardContent>
              </Link>
            </Card>
            
            <Card className="hover:shadow-md transition-all cursor-pointer">
              <Link to="/armazenagem/carregamento/enderecamento">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Truck className="mr-2 text-cross-blue" size={20} />
                    Endereçamento no Caminhão
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Organize o layout de carregamento no caminhão
                  </p>
                </CardContent>
              </Link>
            </Card>
            
            <Card className="hover:shadow-md transition-all cursor-pointer">
              <Link to="/armazenagem/carregamento/checklist">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <FileText className="mr-2 text-cross-blue" size={20} />
                    Checklist com Registro Fotográfico
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Documente o carregamento com checklist e fotos
                  </p>
                </CardContent>
              </Link>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default RecebimentoOverview;
