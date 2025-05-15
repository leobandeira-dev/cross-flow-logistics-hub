
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BarChart, PieChart, Table, Download, Printer, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ReportCard = ({ title, description, icon: Icon, path }: { 
  title: string; 
  description: string; 
  icon: React.ElementType;
  path: string;
}) => {
  const navigate = useNavigate();
  
  return (
    <Card className="hover:bg-accent/10 cursor-pointer transition-colors" onClick={() => navigate(path)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Gerar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ReportsDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  
  const reportsList = [
    {
      module: 'coletas',
      title: 'Solicitações por Período',
      description: 'Relatório de solicitações de coleta por período',
      icon: BarChart,
      path: '/relatorios/coletas/solicitacoes'
    },
    {
      module: 'coletas',
      title: 'Status das Aprovações',
      description: 'Status atual de todas as aprovações de coletas',
      icon: PieChart,
      path: '/relatorios/coletas/aprovacoes'
    },
    {
      module: 'armazenagem',
      title: 'Volumes por Endereçamento',
      description: 'Distribuição de volumes nos endereços do armazém',
      icon: Table,
      path: '/relatorios/armazenagem/volumes'
    },
    {
      module: 'armazenagem',
      title: 'Movimentações Internas',
      description: 'Histórico de todas as movimentações internas',
      icon: BarChart,
      path: '/relatorios/armazenagem/movimentacoes'
    },
    {
      module: 'carregamento',
      title: 'Ordens de Carregamento',
      description: 'Relatório das ordens de carregamento por período',
      icon: FileText,
      path: '/relatorios/carregamento/ordens'
    },
    {
      module: 'expedicao',
      title: 'Faturamento Mensal',
      description: 'Relatório financeiro de faturamento mensal',
      icon: BarChart,
      path: '/relatorios/expedicao/faturamento'
    },
    {
      module: 'motoristas',
      title: 'Performance de Motoristas',
      description: 'Desempenho e métricas de motoristas',
      icon: PieChart,
      path: '/relatorios/motoristas/performance'
    },
    {
      module: 'sac',
      title: 'Ocorrências por Tipo',
      description: 'Análise de ocorrências por tipo e status',
      icon: PieChart,
      path: '/relatorios/sac/ocorrencias'
    },
  ];

  const filteredReports = reportsList.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = moduleFilter === 'all' || report.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  return (
    <MainLayout title="Relatórios">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center w-full sm:w-auto">
            <Input
              placeholder="Buscar relatório..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80"
              prefix={<Search className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filtrar por módulo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os módulos</SelectItem>
                <SelectItem value="coletas">Coletas</SelectItem>
                <SelectItem value="armazenagem">Armazenagem</SelectItem>
                <SelectItem value="carregamento">Carregamento</SelectItem>
                <SelectItem value="expedicao">Expedição</SelectItem>
                <SelectItem value="motoristas">Motoristas</SelectItem>
                <SelectItem value="sac">SAC</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="todos" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
            <TabsTrigger value="recentes">Recentes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="todos" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.length > 0 ? (
                filteredReports.map((report, index) => (
                  <ReportCard 
                    key={index}
                    title={report.title}
                    description={report.description}
                    icon={report.icon}
                    path={report.path}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">Nenhum relatório encontrado com os filtros atuais</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="favoritos" className="mt-0">
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">Sem relatórios favoritos</h3>
              <p className="text-muted-foreground mt-1">Adicione relatórios aos favoritos para visualizá-los aqui</p>
            </div>
          </TabsContent>
          
          <TabsContent value="recentes" className="mt-0">
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">Nenhum relatório recente</h3>
              <p className="text-muted-foreground mt-1">Os relatórios acessados recentemente aparecerão aqui</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ReportsDashboard;
