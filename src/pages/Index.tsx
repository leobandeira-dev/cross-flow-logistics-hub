
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import MainLayout from '../components/layout/MainLayout';
import StatCard from '../components/dashboard/StatCard';
import ChartCard from '../components/dashboard/ChartCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import KPICard from '../components/dashboard/KPICard';
import TimelineChart from '../components/dashboard/TimelineChart';
import DateRangeSelector from '../components/dashboard/DateRangeSelector';
import { 
  Truck, 
  Package, 
  AlertCircle, 
  FileText, 
  Clock, 
  Calendar,
  CheckCircle,
  BarChart,
  TrendingUp
} from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';

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

// Novo mock de dados para os indicadores solicitados
const tempoPendentesAprovacao = [
  { name: '1 dia', value: 12 },
  { name: '2 dias', value: 8 },
  { name: '3+ dias', value: 5 },
];

const tempoColetaAposAprovacao = [
  { name: '1 dia', value: 18 },
  { name: '2 dias', value: 12 },
  { name: '3+ dias', value: 7 },
];

const coletasNaoEfetuadas = [
  { name: '1 dia', value: 15 },
  { name: '2 dias', value: 10 },
  { name: '3+ dias', value: 6 },
];

const tempoNotasSemEmbarque = [
  { name: '1 dia', value: 22 },
  { name: '2 dias', value: 14 },
  { name: '3+ dias', value: 8 },
];

const atrasoEntregas = [
  { name: '1 dia', value: 9 },
  { name: '2 dias', value: 5 },
  { name: '3+ dias', value: 3 },
];

const tempoProcessoMedio = [
  { name: 'Solicitação a Aprovação', value: 1.2 },
  { name: 'Aprovação a Coleta', value: 1.5 },
  { name: 'Tempo em Galpão', value: 2.1 },
  { name: 'Tempo em Viagem', value: 3.2 },
];

const kpiData = [
  { 
    title: 'Tempo Médio Aprovação', 
    value: '1,2', 
    unit: 'dias',
    trend: { value: 10, positive: true } 
  },
  { 
    title: 'Tempo Médio Coleta', 
    value: '1,5', 
    unit: 'dias',
    trend: { value: 5, positive: true } 
  },
  { 
    title: 'Tempo Médio em Galpão', 
    value: '2,1', 
    unit: 'dias',
    trend: { value: 3, positive: false } 
  },
  { 
    title: 'Atrasos em Entregas', 
    value: '8%', 
    unit: '',
    trend: { value: 2, positive: true } 
  },
];

const Index = () => {
  // Initialize with the last 30 days as the default date range
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  return (
    <MainLayout title="Dashboard">
      {/* Date Range Selector */}
      <DateRangeSelector dateRange={dateRange} onDateRangeChange={setDateRange} />
      
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

      {/* KPIs de tempo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard 
          title="Tempo Médio Aprovação" 
          value="1,2" 
          unit="dias"
          trend={{ value: 10, positive: true }}
          navigateTo="/coletas/aprovacoes"
          filterParams={{ status: "pending", sort: "oldest" }}
        />
        <KPICard 
          title="Tempo Médio Coleta" 
          value="1,5" 
          unit="dias"
          trend={{ value: 5, positive: true }}
          navigateTo="/coletas/alocacao"
          filterParams={{ type: "pending" }}
        />
        <KPICard 
          title="Tempo Médio em Galpão" 
          value="2,1" 
          unit="dias"
          trend={{ value: 3, positive: false }}
          navigateTo="/armazenagem"
          filterParams={{ storage: "active" }}
        />
        <KPICard 
          title="Atrasos em Entregas" 
          value="8%" 
          unit=""
          trend={{ value: 2, positive: true }}
          navigateTo="/motoristas/cargas"
          filterParams={{ status: "delayed" }}
        />
      </div>
      
      {/* Gráfico de timeline do processo */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-muted-foreground" />
              Tempo Médio por Etapa do Processo (dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TimelineChart 
              data={tempoProcessoMedio} 
              navigateTo="/coletas/aprovacoes"
              filterParams={{ view: "process" }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Indicadores de tempo de aprovação e coleta */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard 
          title="Solicitações Pendentes de Aprovação" 
          data={tempoPendentesAprovacao} 
          color="#0098DA"
          navigateTo="/coletas/aprovacoes"
          filterParams={{ status: "pending" }}
        />
        <ChartCard 
          title="Tempo de Coleta Após Aprovação" 
          data={tempoColetaAposAprovacao} 
          color="#2D363F"
          navigateTo="/coletas/alocacao"
          filterParams={{ status: "approved", sort: "pending_collection" }}
        />
      </div>

      {/* Indicadores de coletas não efetuadas e notas sem embarque */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard 
          title="Coletas Não Efetuadas" 
          data={coletasNaoEfetuadas} 
          color="#EF4444"
          navigateTo="/coletas/alocacao"
          filterParams={{ status: "failed" }}
        />
        <ChartCard 
          title="Notas Fiscais Sem Embarque" 
          data={tempoNotasSemEmbarque} 
          color="#F59E0B"
          navigateTo="/armazenagem/recebimento/notas"
          filterParams={{ status: "without_shipment" }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard 
          title="Solicitações de Coleta (Últimos 7 dias)" 
          data={collectRequestsChart} 
          color="#0098DA"
          navigateTo="/coletas/solicitacoes"
          filterParams={{ period: "7d" }}
        />
        <ChartCard 
          title="Desempenho de Motoristas" 
          data={driverPerformanceChart} 
          color="#2D363F"
          navigateTo="/motoristas/cadastro"
          filterParams={{ sort: "performance" }}
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
            title="Atraso nas Entregas" 
            data={atrasoEntregas} 
            color="#EF4444"
            navigateTo="/motoristas/cargas"
            filterParams={{ status: "delayed" }}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
