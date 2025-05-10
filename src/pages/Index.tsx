
import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import StatCard from '../components/dashboard/StatCard';
import ChartCard from '../components/dashboard/ChartCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import { Truck, Package, AlertCircle, BarChart3, FileText } from 'lucide-react';

// Mock data
const recentCollectRequests = [
  { id: 'COL-2023-001', cliente: 'Indústria ABC Ltda', data: '10/05/2023', origem: 'São Paulo, SP', destino: 'Campinas, SP', status: 'pending' },
  { id: 'COL-2023-002', cliente: 'Distribuidora XYZ', data: '10/05/2023', origem: 'Rio de Janeiro, RJ', destino: 'Niterói, RJ', status: 'approved' },
  { id: 'COL-2023-003', cliente: 'Transportes Rápidos', data: '09/05/2023', origem: 'Belo Horizonte, MG', destino: 'São Paulo, SP', status: 'rejected' },
  { id: 'COL-2023-004', cliente: 'Logística Expressa', data: '09/05/2023', origem: 'Curitiba, PR', destino: 'Florianópolis, SC', status: 'approved' },
];

const collectRequestsChart = [
  { name: 'Segunda', value: 12 },
  { name: 'Terça', value: 19 },
  { name: 'Quarta', value: 15 },
  { name: 'Quinta', value: 22 },
  { name: 'Sexta', value: 28 },
  { name: 'Sábado', value: 9 },
  { name: 'Domingo', value: 4 },
];

const driverPerformanceChart = [
  { name: 'José Silva', value: 95 },
  { name: 'Carlos Santos', value: 88 },
  { name: 'Maria Oliveira', value: 92 },
  { name: 'Pedro Almeida', value: 78 },
  { name: 'Ana Costa', value: 85 },
];

const occurrencesChart = [
  { name: 'Atraso', value: 14 },
  { name: 'Dano', value: 5 },
  { name: 'Extravio', value: 2 },
  { name: 'Recusa', value: 8 },
  { name: 'Outros', value: 3 },
];

const Index = () => {
  return (
    <MainLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Coletas Pendentes" 
          value="24" 
          icon={<Truck className="text-cross-blue" />}
          trend={{ value: 8, positive: true }}
          color="blue"
        />
        <StatCard 
          title="Cargas em Trânsito" 
          value="36" 
          icon={<Package className="text-cross-gray" />}
          trend={{ value: 12, positive: true }}
          color="gray"
        />
        <StatCard 
          title="Ocorrências Abertas" 
          value="7" 
          icon={<AlertCircle className="text-cross-error" />}
          trend={{ value: 2, positive: false }}
          color="red"
        />
        <StatCard 
          title="Expedições Hoje" 
          value="18" 
          icon={<FileText className="text-cross-success" />}
          trend={{ value: 5, positive: true }}
          color="green"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard 
          title="Solicitações de Coleta (Últimos 7 dias)" 
          data={collectRequestsChart} 
          color="#0098DA"
        />
        <ChartCard 
          title="Desempenho de Motoristas" 
          data={driverPerformanceChart} 
          color="#2D363F"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Coleta Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={[
                  { header: 'ID', accessor: 'id' },
                  { header: 'Cliente', accessor: 'cliente' },
                  { header: 'Data', accessor: 'data' },
                  { header: 'Origem', accessor: 'origem' },
                  { header: 'Destino', accessor: 'destino' },
                  { 
                    header: 'Status', 
                    accessor: 'status',
                    cell: (row) => {
                      const statusMap: any = {
                        'pending': { type: 'warning', text: 'Pendente' },
                        'approved': { type: 'success', text: 'Aprovado' },
                        'rejected': { type: 'error', text: 'Recusado' },
                      };
                      const status = statusMap[row.status];
                      return <StatusBadge status={status.type} text={status.text} />;
                    }
                  }
                ]}
                data={recentCollectRequests}
                onRowClick={(row) => console.log('Row clicked:', row)}
              />
            </CardContent>
          </Card>
        </div>
        <div>
          <ChartCard 
            title="Ocorrências por Tipo" 
            data={occurrencesChart} 
            color="#EF4444"
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
