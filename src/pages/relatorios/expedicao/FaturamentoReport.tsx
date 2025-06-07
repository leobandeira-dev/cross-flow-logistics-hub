import React, { useRef, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { ReportSettings } from '@/components/relatorios/ReportSettings';
import ExportActions from '@/components/relatorios/ExportActions';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A570FF'];

const receitaMensal = [
  { mes: 'Jan', faturamento: 125000, custo: 85000 },
  { mes: 'Fev', faturamento: 148000, custo: 95000 },
  { mes: 'Mar', faturamento: 165000, custo: 105000 },
  { mes: 'Abr', faturamento: 182000, custo: 118000 },
  { mes: 'Mai', faturamento: 204000, custo: 130000 },
  { mes: 'Jun', faturamento: 220000, custo: 140000 },
];

const clientesData = [
  { name: 'Cliente A', value: 85000, fill: '#0088FE' },
  { name: 'Cliente B', value: 65000, fill: '#00C49F' },
  { name: 'Cliente C', value: 43000, fill: '#FFBB28' },
  { name: 'Cliente D', value: 32000, fill: '#FF8042' },
  { name: 'Outros', value: 19000, fill: '#A570FF' },
];

const servicosData = [
  { servico: 'Frete', valor: 150000 },
  { servico: 'Armazenagem', valor: 95000 },
  { servico: 'Cross-docking', valor: 78000 },
  { servico: 'Embalagem', valor: 45000 },
  { servico: 'Etiquetagem', valor: 32000 },
  { servico: 'Outros', valor: 44000 },
];

export const FaturamentoReport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [settings, setSettings] = useState({
    chartType: 'line',
    showLegend: true,
    showGrid: true,
    dateRange: '180d',
    autoRefresh: false,
  });
  const reportRef = useRef<HTMLDivElement>(null);

  const updateSettings = (newSettings: any) => {
    setSettings(newSettings);
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const calcularLucro = (faturamento: number, custo: number) => {
    return faturamento - custo;
  };

  const calcularMargem = (faturamento: number, custo: number) => {
    return ((faturamento - custo) / faturamento * 100).toFixed(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center relative w-full sm:w-auto">
          <Search className="h-4 w-4 absolute left-3 text-muted-foreground" />
          <Input
            placeholder="Buscar faturamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full sm:w-[300px]"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          
          <ReportSettings 
            updateSettings={updateSettings}
            defaultSettings={settings}
          />
          
          <ExportActions 
            title="Relatório de Faturamento"
            fileName="faturamento-mensal"
            contentRef={reportRef}
            data={[...receitaMensal, ...clientesData.map(c => ({ name: c.name, faturamento: c.value }))]}
          />
        </div>
      </div>

      <div ref={reportRef}>
        <Tabs defaultValue="mensal">
          <TabsList>
            <TabsTrigger value="mensal">Análise Mensal</TabsTrigger>
            <TabsTrigger value="clientes">Por Cliente</TabsTrigger>
            <TabsTrigger value="servicos">Por Serviço</TabsTrigger>
            <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mensal" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Faturamento Total', value: formatCurrency(1044000), change: '+8.5%', trend: 'up' },
                { label: 'Custo Operacional', value: formatCurrency(673000), change: '+5.2%', trend: 'up' },
                { label: 'Margem de Lucro', value: '35.5%', change: '+2.3%', trend: 'up' },
              ].map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-2xl font-medium">{stat.value}</p>
                        <span className={`text-xs ${stat.trend === 'up' ? (stat.label === 'Custo Operacional' ? 'text-red-600' : 'text-green-600') : (stat.label === 'Custo Operacional' ? 'text-green-600' : 'text-red-600')}`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Faturamento vs. Custo (Semestral)</CardTitle>
                <CardDescription>Análise mensal de receitas e custos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {settings.chartType === 'line' ? (
                      <LineChart
                        data={receitaMensal}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        {settings.showGrid && <CartesianGrid strokeDasharray="3 3" />}
                        <XAxis dataKey="mes" />
                        <YAxis tickFormatter={(value) => `R$ ${value/1000}k`} />
                        <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, '']} />
                        {settings.showLegend && <Legend />}
                        <Line type="monotone" dataKey="faturamento" name="Faturamento" stroke="#10B981" strokeWidth={2} />
                        <Line type="monotone" dataKey="custo" name="Custo" stroke="#EF4444" strokeWidth={2} />
                      </LineChart>
                    ) : (
                      <AreaChart
                        data={receitaMensal}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        {settings.showGrid && <CartesianGrid strokeDasharray="3 3" />}
                        <XAxis dataKey="mes" />
                        <YAxis tickFormatter={(value) => `R$ ${value/1000}k`} />
                        <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, '']} />
                        {settings.showLegend && <Legend />}
                        <Area type="monotone" dataKey="faturamento" name="Faturamento" stroke="#10B981" fill="#10B98133" />
                        <Area type="monotone" dataKey="custo" name="Custo" stroke="#EF4444" fill="#EF444433" />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="clientes">
            <Card>
              <CardHeader>
                <CardTitle>Faturamento por Cliente</CardTitle>
                <CardDescription>Distribuição do faturamento entre os principais clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={clientesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value, percent }) => `${name}: ${formatCurrency(value)} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {clientesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [formatCurrency(value as number), 'Faturamento']} />
                      {settings.showLegend && <Legend />}
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="servicos">
            <Card>
              <CardHeader>
                <CardTitle>Faturamento por Serviço</CardTitle>
                <CardDescription>Distribuição do faturamento por tipo de serviço</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={servicosData}
                      layout="vertical"
                      margin={{
                        top: 20,
                        right: 30,
                        left: 100,
                        bottom: 5,
                      }}
                    >
                      {settings.showGrid && <CartesianGrid strokeDasharray="3 3" />}
                      <XAxis type="number" tickFormatter={(value) => `R$ ${value/1000}k`} />
                      <YAxis dataKey="servico" type="category" />
                      <Tooltip formatter={(value) => [formatCurrency(value as number), 'Faturamento']} />
                      {settings.showLegend && <Legend />}
                      <Bar dataKey="valor" name="Faturamento" fill="#0088FE" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="detalhes">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Faturamento</CardTitle>
                <CardDescription>Lista detalhada de todas as receitas</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Add table or detailed list view here */}
                <div className="text-center text-gray-500 py-8">
                  Implementação da visualização detalhada em desenvolvimento
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FaturamentoReport;
